import React, { FC } from "react";
import { useStaticQuery, graphql } from "gatsby";

import Header from "../header";

const Layout: FC = ({ children }) => {
  const data = useStaticQuery<QueryResponse>(
    graphql`
      query {
        site {
          siteMetadata {
            author {
              github
              name
            }
          }
        }
      }
    `
  );
  const author = data.site.siteMetadata.author;

  return (
    <>
      <Header />
      <div className="container">
        <main>{children}</main>
        <footer>
          <p>
            Hosted with{" "}
            <a
              href="https://aws.amazon.com/cloudfront/"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS CloudFront
            </a>{" "}
            by{" "}
            <a href={author.github} target="_blank" rel="noopener noreferrer">
              {author.name}
            </a>
          </p>
          <p>
            © {new Date().getFullYear()}, Built with
            {` `}
            <a
              href="https://www.gatsbyjs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gatsby
            </a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Layout;

type QueryResponse = {
  site: {
    siteMetadata: {
      author: {
        github: string;
        name: string;
      };
    };
  };
};
