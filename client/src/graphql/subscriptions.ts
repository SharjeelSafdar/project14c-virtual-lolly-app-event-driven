/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onLollyCreated = /* GraphQL */ `
  subscription OnLollyCreated($clientId: String!) {
    onLollyCreated(clientId: $clientId) {
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
`;
