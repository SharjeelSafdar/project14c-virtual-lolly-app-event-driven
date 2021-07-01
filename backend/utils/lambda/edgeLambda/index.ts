import {
  CloudFrontEvent,
  CloudFrontRequest,
  CloudFrontResponse,
  Handler,
} from "aws-lambda";
import * as AWS from "aws-sdk";
import lollyTemplate from "./lollyTemplate";
import { Lolly } from "./types";

type CFResponse = CloudFrontResponse & {
  body?: string;
};

interface CloudFrontResponseEvent {
  Records: Array<{
    cf: CloudFrontEvent & {
      readonly request: CloudFrontRequest;
      response: CFResponse;
    };
  }>;
}

type CloudFrontResponseHandler = Handler<CloudFrontResponseEvent, CFResponse>;

const ddbClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
const TableName = "P14cLolliesTable";
// The generated page contains some dynamic data, so we don't want
// it to stay in cache for long
const cacheControlMaxAge = 3;

export const handler: CloudFrontResponseHandler = async (
  event,
  context,
  callback
) => {
  console.log(
    "Origin Response: ",
    JSON.stringify(event.Records[0].cf, null, 2)
  );

  const config = event.Records[0].cf.config;
  const distDomain = `https://${config.distributionDomainName}`;
  const request = event.Records[0].cf.request;
  const uri = request.uri;
  let response = event.Records[0].cf.response;

  // If there is no error, do nothing.
  if (!isStatusErroneous(+response.status)) {
    return response;
  }

  // Get Lolly Id from URI
  const lollyId = getLollyId(uri);
  if (lollyId === null) {
    // Couldn't get id from URI, Redirect to 404.
    response = redirectTo404Response(response, `${distDomain}/404`);
  } else {
    try {
      const res = await getLollyFromDdb(lollyId);
      if (!res.Item) {
        throw new Error(`No item found, id: + ${lollyId}`);
      }
      response = lollyPageResponse(response, res.Item as Lolly, distDomain);
    } catch (err) {
      console.log("Error fetching lolly from DDB: ", err);
      response = redirectTo404Response(response, `${distDomain}/404`);
    }
  }

  return response;
};

const isStatusErroneous = (status: number) => status >= 400 && status <= 599;

const getLollyId = (uri: string) => {
  // const m = uri.match(/^\/lolly\/([a-z0-9-]+)$/i);
  // const id = Array.isArray(m) && m.length > 1 ? m[1] : null;
  let id = null;
  if (uri.startsWith("/lolly/")) {
    id = uri.slice(7);
  }

  return id;
};

const getLollyFromDdb = async (id: string) => {
  return await ddbClient
    .get({
      TableName,
      Key: { id },
    })
    .promise();
};

const lollyPageResponse = (
  response: CFResponse,
  lollyData: Lolly,
  cfDistDomain: string
) => {
  response.status = "200";
  response.statusDescription = "OK";
  response.headers["content-type"] = [
    {
      key: "Content-Type",
      value: "text/html;charset=UTF-8",
    },
  ];
  response.headers["cache-control"] = [
    {
      key: "Cache-Control",
      value: `max-age=${cacheControlMaxAge}`,
    },
  ];
  response.body = lollyTemplate(lollyData, cfDistDomain);

  return response;
};

const redirectTo404Response = (response: CFResponse, redirectPath: string) => {
  response.status = "302";
  response.statusDescription = "Found";
  response.headers["location"] = [
    {
      key: "Location",
      value: redirectPath,
    },
  ];
  response.body = "";

  return response;
};
