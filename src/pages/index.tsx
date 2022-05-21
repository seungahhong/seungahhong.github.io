// import SEO from 'components/seo';
import { graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';
import { PostListItemType } from 'types/PostItem';
import Template from 'components/Base/Template';
import PostList from 'components/Post/PostList';

type IndexPageProps = {
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
      edges: PostListItemType[];
    };
  };
};

const IndexPage: FunctionComponent<IndexPageProps> = ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl, social },
    },
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      social={social}
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
        social {
          facebook
          github
          notion
          linkedin
        }
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
