// import SEO from 'components/seo';
import { graphql } from 'gatsby';
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import styled from 'styled-components';
import { PostListItemType } from 'types/PostItem';
import Template from 'components/Base/Template';
import PostList from 'components/Post/PostList';
import PostHeadTagFilter from 'components/Post/PostHeadTagFilter';
import { useIsMobile } from '../helpers/hooks/useMedia';
import PostAsideFilter from 'components/Post/PostAsideFilter';

type IndexPageProps = {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: string;
        type: string;
        siteUrl: string;
        INIT_PER_PAGE_NUMBER: number;
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
  display: flex;
  margin-left: 20%;
  margin-top: 20px;
  padding: 0 24px;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const IndexPage: FunctionComponent<IndexPageProps> = ({
  data: {
    site: {
      siteMetadata: {
        title,
        description,
        siteUrl,
        INIT_PER_PAGE_NUMBER,
        social,
      },
    },
    allMarkdownRemark: { edges },
  },
}) => {
  const [posts, setPosts] = useState<PostListItemType[]>(edges);
  const [type, setType] = useState<string>('CATEGORY');
  const [filter, setFilter] = useState<string>('ALL');
  const isMobile = useIsMobile();

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

  useEffect(() => {
    if (isMobile) {
      setType(prev => {
        if (prev === 'CATEGORY') {
          setFilter('ALL');
        }

        return 'TAGS';
      });
    }
  }, [isMobile]);

  const handleFilter = useCallback((type, filter) => {
    setFilter(filter);
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
        <PostContent>
          {isMobile && (
            <PostHeadTagFilter
              posts={edges}
              filter={filter}
              handleFilter={handleFilter}
            />
          )}
          <PostList posts={posts} INIT_PER_PAGE_NUMBER={INIT_PER_PAGE_NUMBER} />
        </PostContent>
        {!isMobile && (
          <PostAsideFilter
            type={type}
            posts={edges}
            filter={filter}
            handleFilter={handleFilter}
          />
        )}
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
        INIT_PER_PAGE_NUMBER
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
          frontmatter___tags
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
