<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Project 14C: Serverless JAMstack Virtual Lolly App with Event-Driven Architecture
</h1>

## Link to Web App

A serverless JAMstack Virtual Lolly App with Gatsby, TypeScript, AppSync, DynamoDB, Lambda, StepFunction, EventBridge, CloudFront, and Lambda Edge. The web app has been deployed to AWS CloudFront, and can be accessed [here](https://d3qfzh71og45l0.cloudfront.net/).

## Features

The following are some of the features of this project:

- A form for creating a new Lolly at "/create-new" using [Formik](https://formik.org/docs/overview) and [Yup](https://github.com/jquense/yup)
- Uses [DynamoDB](https://aws.amazon.com/dynamodb/) table to store the information about all the lollipops
- A GraphQL API with [AWS AppSync](https://aws.amazon.com/appsync/) to interact with DynamoDB
- All lollies are fetched, and static pages are built for each one at build time.
- A [Lambda@Edge Function](https://aws.amazon.com/lambda/edge/) works as an SSR fallback: all lollies not having a static page are redirected to this function.
- Demonstrates CRUD operations using DynamoDB through the GraphQL API
- Uses [Amplify](https://amplify.com/) for GraphQL queries and mutations at client side
- Bootstrapped with [GatsbyJS](https://www.gatsbyjs.com/)
- Additionally, includes TypeScript support for gatsby-config, gatsby-node, gatsby-browser and gatsby-ssr files
- Site hosted on [AWS CloudFront](https://aws.amazon.com/cloudfront/)
- CI/CD with [GitHub Actions](https://docs.github.com/en/actions)
- Completely typed with [TypeScript](https://www.typescriptlang.org/)
- Completely interactive and responsive design with vanilla CSS.

## Backend

This AWS CDK App deploys the backend infrastructure for [Project 13C](https://github.com/SharjeelSafdar/project13c-virtual-lolly-app-with-aws). The app consists of two stacks.

### Stack 1: AppSync GraphQL API and DynamoDB Table

It contanis of the AWS services used by the web client. It has the following constructs:

- A DynamoDB Table to contain the lollies saved by the users
- An AppSync GraphQL API to access the lollies in the Table

### Stack 2: CloudFront Distribution, S3 Bucket and Lambda Edge

It contains the infrastructure to deploy frontend client. It has the following constructs:

- A S3 Bucket with public access to store the static assets of Gatsby web app
- A Cloud Front Distribution to serve the static assets through a CDN
- A Lambda@Edge function triggered at `origin_response` event that tries to build and serve a static page for a lolly for which there is no static page in the S3 bucket yet. Otherwise, it redirects to `/404` page
