import * as AWS from "aws-sdk";
import fetch from "node-fetch";
import { HandlerType } from "./types";

const url = process.env.APPSYNC_GRAPHQL_API_ENDPOINT as string;
const apiKey = process.env.APPSYNC_API_KEY as string;

export const handler: HandlerType = async event => {
  console.log(`Event = ${JSON.stringify(event, null, 2)}`);

  try {
    const postBody = {
      query: /* GraphQL */ `
        mutation LollyCreated($clientId: String!, $lolly: LollyInput!) {
          lollyCreated(clientId: $clientId, lolly: $lolly) {
            clientId
            lolly {
              id
              topColor
              middleColor
              bottomColor
              recipientName
              message
              sendersName
            }
          }
        }
      `,
      variables: event,
    };
    console.log(`Post Body = ${JSON.stringify(postBody, null, 2)}`);

    const endpoint = new AWS.Endpoint(url);

    const options = {
      method: "POST",
      body: JSON.stringify(postBody),
      headers: {
        host: endpoint.host,
        "Content-Type": "application/json; charset=UTF-8",
        "x-api-key": apiKey,
      },
    };
    const response = await fetch(endpoint.href, options);
    const json = await response.json();

    console.log("Mutation Completed: ", JSON.stringify(json, null, 2));
    return { lolly: event.lolly };
  } catch (error) {
    console.log(
      "Error in calling AppSync mutation",
      JSON.stringify(error, null, 2)
    );
    return null;
  }
};
