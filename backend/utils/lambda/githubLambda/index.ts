import * as AWS from "aws-sdk";
import fetch from "node-fetch";

const owner = "SharjeelSafdar";
const repo = "project14c-virtual-lolly-app-event-driven";
const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
const oauthToken = process.env.OAUTH_TOKEN as string;

export const handler = async () => {
  try {
    const endpoint = new AWS.Endpoint(url);

    const options = {
      method: "POST",
      body: JSON.stringify({
        event_type: "new_lolly_created",
      }),
      headers: {
        host: endpoint.host,
        accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${oauthToken}`,
      },
    };

    await fetch(endpoint.href, options);

    console.log("Request to GitHub Successful");
  } catch (error) {
    console.log(
      "Error in sending request to GitHub",
      JSON.stringify(error, null, 2)
    );
  }
};
