import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import PostContent from 'components/Post/PostContent';
import Template from 'components/Common/Template';

type PostTemplateProps = {
  data: {
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
    allMarkdownRemark: { edges },
  },
}) {
  const {
    node: { html },
  } = edges[0];

  return (
    <Template>
      <PostContent html={html} />
    </Template>
  );
};

export default PostTemplate;

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
            categories
            tags
          }
        }
      }
    }
  }
`;
