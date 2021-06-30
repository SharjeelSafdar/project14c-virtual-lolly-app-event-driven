import { GatsbyConfig } from "gatsby";

export default {
  siteMetadata: {
    title: `Virtual Lolly App`,
    description: `A Serverless JAMstack Virtual Lolly App with Event-Driven Architecture.`,
    author: `Mian Muhammad Sharjeel Safdar`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Virtual Lolly App`,
        short_name: `Virtual Lolly`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
} as GatsbyConfig;
