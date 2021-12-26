import GlobalStyle from 'components/Common/GlobalStyle';
import PostContent from 'components/Post/PostContent';
import { SEO } from 'components/seo';
import { graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';

type IndexPageProps = {
  data: {
    allMarkdownRemark: {
      edges: [
        {
          node: {
            id: string;
            frontmatter: {
              title: string;
              summary: string;
              date: string;
              categories: string[];
            };
            html: string;
          };
        },
      ];
    };
  };
};

const IndexPage: FunctionComponent<IndexPageProps> = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <>
      <GlobalStyle />
      <SEO />
      <div>hello hong tech blog</div>
      {edges.map(({ node }, index) => (
        <PostContent key={index} html={node.html} />
      ))}
    </>
  );
};

export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            title
            date
            categories
          }
          html
        }
      }
    }
  }
`;

export default IndexPage;
