/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLolly = /* GraphQL */ `
  mutation CreateLolly($clientId: String!, $newLolly: NewLollyInput!) {
    createLolly(clientId: $clientId, newLolly: $newLolly)
  }
`;
export const lollyCreated = /* GraphQL */ `
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
`;
