import Footer from 'components/Common/Footer';
import GlobalStyle from 'components/Common/GlobalStyle';
import PostList from 'components/Main/PostList';
import SEO from 'components/seo';
import { graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { PostListItemType } from 'types/PostItem';

type IndexPageProps = {
  data: {
    allMarkdownRemark: {
      edges: PostListItemType[];
    };
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const IndexPage: FunctionComponent<IndexPageProps> = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <Container>
      <GlobalStyle />
      <SEO />
      <PostList posts={edges} />
      <Footer />
    </Container>
  );
};

export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
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

export default IndexPage;
