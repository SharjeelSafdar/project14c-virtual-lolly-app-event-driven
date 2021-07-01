import { GatsbyConfig } from "gatsby";

import awsConfig from "../aws-exports";

export default {
  siteMetadata: {
    title: `Virtual Lolly App`,
    description: `A Serverless JAMstack Virtual Lolly App with Event-Driven Architecture.`,
    author: {
      name: `Mian Muhammad Sharjeel Safdar`,
      email: `miansharjeelsafdar@gmail.com`,
      github: `https://github.com/SharjeelSafdar/`,
    },
  },
  plugins: [
    // Fetches all lollies from the backend at build time to build static pages
    {
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: `graphqlAppsync`,
        fieldName: `virtualLolly`,
        url: awsConfig.aws_appsync_graphqlEndpoint,
        headers: {
          "x-api-key": awsConfig.aws_appsync_apiKey,
        },
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Virtual Lolly App`,
        short_name: `Virtual Lolly`,
        start_url: `/`,
        background_color: `#fa73d9`,
        theme_color: `#fa73d9`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
} as GatsbyConfig;
