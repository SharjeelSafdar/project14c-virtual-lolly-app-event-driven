import { EventBridgeHandler } from "aws-lambda";

export type LollyInputType = {
  topColor: string;
  middleColor: string;
  bottomColor: string;
  recipientName: string;
  message: string;
  sendersName: string;
};

export type LollyType = LollyInputType & {
  id: string;
};

export type DetailType = {
  clientId: string;
  newLolly: LollyInputType;
};

export type ReturnType = {
  clientId: string;
  lolly: LollyType;
} | null;

export type HandlerType = EventBridgeHandler<string, DetailType, ReturnType>;
