import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import PostContent from 'components/Post/PostContent';
import Template from 'components/Common/Template';
import CommentWidget from 'components/Post/CommentWidget';

type PostTemplateProps = {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: string;
        type: string;
        siteUrl: string;
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
          };
        },
      ];
    };
  };
};

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges },
  },
}) {
  const {
    node: { html },
  } = edges[0];

  return (
    <Template title={title} description={description} url={siteUrl}>
      <PostContent html={html} />
      <CommentWidget />
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
        }
      }
    }
  }
`;