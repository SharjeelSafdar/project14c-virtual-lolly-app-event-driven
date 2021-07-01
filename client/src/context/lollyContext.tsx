import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { API } from "aws-amplify";
import { navigate } from "gatsby";

import { createLolly } from "../graphql/mutations";
import { onLollyCreated } from "../graphql/subscriptions";
import {
  NewLollyInput,
  CreateLollyMutation,
  CreateLollyMutationVariables,
  OnLollyCreatedSubscription,
  OnLollyCreatedSubscriptionVariables,
} from "../graphql/api";

const initialState: ContextType = {
  isCreating: false,
  createNewLolly: () => {},
};

export const LollyContext = createContext<ContextType>(initialState);

export const useLollyContext = () => useContext(LollyContext);

export const LollyContextProvider: FC = ({ children }) => {
  const [isCreating, setIsCreating] = useState(initialState.isCreating);
  const [clientId] = useState((Math.random() * 1000000000000).toFixed(0));

  /* ************************************************************* */
  /* ********************* Mutation Function ********************* */
  /* ************************************************************* */
  const createNewLolly = async (newLolly: NewLollyInput) => {
    setIsCreating(true);

    try {
      const variables: CreateLollyMutationVariables = { clientId, newLolly };
      const response = (await API.graphql({
        query: createLolly,
        variables,
      })) as { data: CreateLollyMutation };

      console.log(
        "createLolly mutation successful: ",
        response.data.createLolly
      );
    } catch (err) {
      console.log("Error creating new lolly: ", JSON.stringify(err, null, 2));
    }
  };

  /* ***************************************************************** */
  /* ********************* Subscription Function ********************* */
  /* ***************************************************************** */
  const onLollyCreatedSub = async () => {
    const variables: OnLollyCreatedSubscriptionVariables = { clientId };
    const subscription = API.graphql({
      query: onLollyCreated,
      variables,
    }) as any;

    subscription.subscribe({
      next: (status: { value: { data: OnLollyCreatedSubscription } }) => {
        if (status.value.data.onLollyCreated) {
          const data = status.value.data.onLollyCreated;
          console.log("Subscription Data: ", data);
          setIsCreating(false);
          navigate(`/lolly/${data.lolly.id}`);
        }
      },
    });
  };

  useEffect(() => {
    onLollyCreatedSub();
  }, []);

  const value: ContextType = {
    isCreating,
    createNewLolly,
  };

  return (
    <LollyContext.Provider value={value}>{children}</LollyContext.Provider>
  );
};

export interface ContextType {
  isCreating: boolean;
  createNewLolly: (newLolly: NewLollyInput) => void;
}
