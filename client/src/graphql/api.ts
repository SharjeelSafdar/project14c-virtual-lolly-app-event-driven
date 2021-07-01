/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type NewLollyInput = {
  topColor: string,
  middleColor: string,
  bottomColor: string,
  recipientName: string,
  message: string,
  sendersName: string,
};

export type LollyInput = {
  id: string,
  topColor: string,
  middleColor: string,
  bottomColor: string,
  recipientName: string,
  message: string,
  sendersName: string,
};

export type LollyCreatedReturnType = {
  __typename: "LollyCreatedReturnType",
  clientId: string,
  lolly: Lolly,
};

export type Lolly = {
  __typename: "Lolly",
  id: string,
  topColor: string,
  middleColor: string,
  bottomColor: string,
  recipientName: string,
  message: string,
  sendersName: string,
};

export type CreateLollyMutationVariables = {
  clientId: string,
  newLolly: NewLollyInput,
};

export type CreateLollyMutation = {
  createLolly: string,
};

export type LollyCreatedMutationVariables = {
  clientId: string,
  lolly: LollyInput,
};

export type LollyCreatedMutation = {
  lollyCreated:  {
    __typename: "LollyCreatedReturnType",
    clientId: string,
    lolly:  {
      __typename: "Lolly",
      id: string,
      topColor: string,
      middleColor: string,
      bottomColor: string,
      recipientName: string,
      message: string,
      sendersName: string,
    },
  },
};

export type LolliesQuery = {
  lollies:  Array< {
    __typename: "Lolly",
    id: string,
    topColor: string,
    middleColor: string,
    bottomColor: string,
    recipientName: string,
    message: string,
    sendersName: string,
  } | null >,
};

export type OnLollyCreatedSubscriptionVariables = {
  clientId: string,
};

export type OnLollyCreatedSubscription = {
  onLollyCreated?:  {
    __typename: "LollyCreatedReturnType",
    clientId: string,
    lolly:  {
      __typename: "Lolly",
      id: string,
      topColor: string,
      middleColor: string,
      bottomColor: string,
      recipientName: string,
      message: string,
      sendersName: string,
    },
  } | null,
};
