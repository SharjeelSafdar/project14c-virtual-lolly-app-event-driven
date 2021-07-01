import { SNS } from "aws-sdk";
import { HandlerType } from "./types";

const region = process.env.STACK_REGION as string;
const TOPIC_ARN = process.env.TOPIC_ARN as string;
const sns = new SNS({ region });

export const handler: HandlerType = async event => {
  console.log(`Event = ${JSON.stringify(event, null, 2)}`);

  try {
    if (event) {
      await sns
        .publish({
          TopicArn: TOPIC_ARN,
          Subject: "New Lolly Created",
          Message: JSON.stringify(event.lolly, null, 2),
          MessageAttributes: {
            app: {
              DataType: "String",
              StringValue: "virtual-lolly",
            },
          },
        })
        .promise();
      console.log("Message published.");
    } else {
      throw new Error("No lolly information received.");
    }
  } catch (err) {
    console.error(
      "ERROR Publishing To SNS ====>",
      JSON.stringify(err, null, 2)
    );
    throw new Error(err.message);
  }
};
