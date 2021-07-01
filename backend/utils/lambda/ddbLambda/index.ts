import * as AWS from "aws-sdk";
import { randomBytes } from "crypto";

import { HandlerType } from "./types";

const TableName = process.env.LOLLIES_TABLE_NAME as string;
const STACK_REGION = process.env.STACK_REGION as string;
const ddbClient = new AWS.DynamoDB.DocumentClient({ region: STACK_REGION });

export const handler: HandlerType = async event => {
  console.log("Event: ", JSON.stringify(event, null, 2));

  if (!STACK_REGION || !TableName) {
    const message =
      "STACK_REGION and LOLLIES_TABLE_NAME env variables must be provided.";
    console.log(message);
    throw new Error(message);
  }

  const clientId = event.detail.clientId;
  const lollyInput = event.detail.newLolly;
  const lolly = {
    id: randomBytes(16).toString("hex"),
    ...lollyInput,
  };

  try {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName,
      Item: lolly,
    };
    await ddbClient.put(params).promise();
    console.log("New Lolly Added");
    return { clientId, lolly };
  } catch (error) {
    console.log("Error creating new lolly: ", error);
    return null;
  }
};
