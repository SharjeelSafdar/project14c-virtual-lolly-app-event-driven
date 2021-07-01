import { Handler } from "aws-lambda";

export type LollyType = {
  id: string;
  topColor: string;
  middleColor: string;
  bottomColor: string;
  recipientName: string;
  message: string;
  sendersName: string;
};

export type EventType = {
  clientId: string;
  lolly: LollyType;
};

export type ReturnType = {
  lolly: LollyType;
} | null;

export type HandlerType = Handler<EventType, ReturnType>;
