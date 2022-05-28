// import SEO from 'components/seo';
import { graphql } from 'gatsby';
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { PostListItemType } from 'types/PostItem';
import Template from 'components/Base/Template';
import PostList from 'components/Post/PostList';
import PostFilter from 'components/Post/PostFilter';
import styled from 'styled-components';

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

const PostWrapper = styled.div`
  margin-left: 20%;
  padding: 0 24px;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const IndexPage: FunctionComponent<IndexPageProps> = ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl, social },
    },
    allMarkdownRemark: { edges },
  },
}) => {
  const [posts, setPosts] = useState<PostListItemType[]>(edges);
  const [type, setType] = useState<string>('CATEGORY');
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    setPosts(() => {
      if (type === 'CATEGORY') {
        return edges.filter(({ node: { frontmatter } }) => {
          return filter === 'ALL' || frontmatter.category === filter;
        });
      }

      return edges.filter(({ node: { frontmatter } }) => {
        return filter === 'ALL' || frontmatter.tags.includes(filter);
      });
    });
  }, [type, filter, edges]);

  const handleType = useCallback((type: string) => {
    setFilter('ALL');
    setType(type);
  }, []);

  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      social={social}
      isVisibleHeader
    >
      <PostWrapper>
        <PostFilter
          posts={edges}
          filter={filter}
          type={type}
          handleType={handleType}
          handleFilter={setFilter}
        />
        <PostList posts={posts} />
      </PostWrapper>
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
          frontmatter___date
          frontmatter___category
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
          excerpt
        }
      }
    }
  }
`;

export default IndexPage;
