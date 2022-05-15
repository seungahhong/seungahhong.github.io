import Footer from 'components/Common/Footer';
import GlobalStyle from 'components/Common/GlobalStyle';
import Header from 'components/Common/Header';
import Template from 'components/Common/Template';
import PostList from 'components/Main/PostList';
// import SEO from 'components/seo';
import { graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { PostListItemType } from 'types/PostItem';

type IndexPageProps = {
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
      edges: PostListItemType[];
    };
  };
};

const IndexPage: FunctionComponent<IndexPageProps> = ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      isVisibleHeader
    >
      <PostList posts={edges} />
    </Template>
  );
};

export const getPostList = graphql`
  query getPostList {
    site {
      siteMetadata {
        title
        description
        author
        type
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: {
        order: [DESC, DESC, ASC]
        fields: [
          frontmatter___category
          frontmatter___date
          frontmatter___title
        ]
      }
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
            category
            tags
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
