import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

interface SeoProps {
  description?: string;
  lang?: string;
  meta?: Array<
    { name: string; content: string } | { property: string; content: string }
  >;
  title: string;
}

const SEO: FC<SeoProps> = ({ description, lang, meta, title }) => {
  const { site } = useStaticQuery<QueryResponse>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author {
              email
              github
              name
            }
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  const defaultTitle = site.siteMetadata.title;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : undefined}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `github:card`,
          content: `summary`,
        },
        {
          name: `github:creator`,
          content: site.siteMetadata?.author.name || ``,
        },
        {
          name: `github:title`,
          content: title,
        },
        {
          name: `github:description`,
          content: metaDescription,
        },
      ].concat(meta || [])}
    />
  );
};

export default SEO;

type QueryResponse = {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      author: {
        email: string;
        github: string;
        name: string;
      };
    };
  };
};
