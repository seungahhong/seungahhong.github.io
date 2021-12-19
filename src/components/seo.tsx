/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';

interface Meta {
  name: string;
  content: string;
}

interface Props {
  title?: string;
  lang?: string;
  meta?: Meta[];
  keywords?: string[];
  description?: string;
}

interface SiteProps {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      author: string;
      type: string;
      url: string;
    };
  };
}

export const SEO = (props: Props) => {
  const lang = props.lang || 'en';
  const meta = props.meta || [];
  const keywords = props.keywords || [];
  const description = props.description || '';

  const { site } = useStaticQuery<SiteProps>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            type
            url
          }
        }
      }
    `,
  );

  const title = props.title || site.siteMetadata.title;
  const metaDescription: string = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      // titleTemplate={`%s | ${title}`}
      meta={[
        {
          content: metaDescription,
          name: `description`,
        },
        {
          content: title,
          property: `og:title`,
        },
        {
          content: metaDescription,
          property: `og:description`,
        },
        {
          content: site.siteMetadata.type,
          property: `og:type`,
        },
        {
          content: site.siteMetadata.url,
          property: `og:url`,
        },
        {
          content: `summary`,
          name: `twitter:card`,
        },
        {
          content: site.siteMetadata.author,
          name: `twitter:creator`,
        },
        {
          content: title,
          name: `twitter:title`,
        },
        {
          content: metaDescription,
          name: `twitter:description`,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                content: keywords.join(`, `),
                name: `keywords`,
              }
            : [],
        )
        .concat(meta)}
    />
  );
};
