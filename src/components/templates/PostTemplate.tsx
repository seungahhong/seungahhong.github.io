import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import PostContent from 'components/Post/PostContent';
import Template from 'components/Base/Template';

type PostTemplateProps = {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: string;
        type: string;
        siteUrl: string;
        social: {
          facebook: string;
          github: string;
          notion: string;
          linkedin: string;
        };
      };
    };
    allMarkdownRemark: {
      edges: [
        {
          node: {
            id: string;
            frontmatter: {
              title: string;
              date: string;
              categories: string;
              tags: string[];
            };
            html: string;
            tableOfContents: string;
          };
        },
      ];
    };
  };
};

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl, social },
    },
    allMarkdownRemark: { edges },
  },
}) {
  const {
    node: { html, tableOfContents, frontmatter },
  } = edges[0];

  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      social={social}
    >
      <PostContent
        {...frontmatter}
        html={html}
        tableOfContents={tableOfContents}
      />
    </Template>
  );
};

export default PostTemplate;

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    site {
      siteMetadata {
        title
        description
        author
        type
        siteUrl
      }
    }
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
            category
            tags
          }
          tableOfContents
        }
      }
    }
  }
`;
