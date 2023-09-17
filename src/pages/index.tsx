// import SEO from 'components/seo';
import { graphql, Link } from 'gatsby';
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { IGatsbyImageData } from 'gatsby-plugin-image';
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
    allFile: {
      edges: [
        {
          node: {
            name: string;
            childImageSharp: {
              gatsbyImageData: IGatsbyImageData;
            };
            publicURL: string;
          };
        },
      ];
    };
  };
};

type SocialImageType = {
  size: number;
};

const PostWrapper = styled.div`
  display: flex;
  margin-left: 20%;
  margin-top: 20px;
  padding: 0 20px;

  @media (max-width: 1024px) {
    margin-left: 0;
    margin-top: 0;
  }
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SocialLink = styled.a<SocialImageType>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  color: #161b21;
  width: 40px;
  height: 40px;
  min-width: 40px;
  font-size: 20px;
  border: none;
  border-radius: 50%;

  & > img {
    width: ${props => `${props.size}px`};
    height: ${props => `${props.size}px`};
  }
`;

const MobileHeaderWrapper = styled.div`
  display: none;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;

  & h1 {
    font-size: 24px;
    margin: 12px 0 8px;
  }

  @media (max-width: 1024px) {
    display: block;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    allFile: { edges: fileEdges },
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
    window.scrollTo(0, 0);
  }, []);

  const githubImage = useMemo(() => {
    return fileEdges.find(item => item.node?.name === 'github');
  }, [fileEdges]);

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
          <MobileHeaderWrapper>
            <Header>
              <Link to={'/'}>
                <h1>홍승아블로그</h1>
              </Link>
              <SocialLink
                href={social?.github}
                rel="noopener noreferrer"
                title="notion"
                target="_blank"
                size={35}
              >
                <img
                  src={githubImage?.node.publicURL}
                  alt="Github Link Image"
                />
              </SocialLink>
            </Header>
            <PostHeadTagFilter
              posts={edges}
              filter={filter}
              handleFilter={handleFilter}
            />
          </MobileHeaderWrapper>
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

export const getPostList = graphql`query getPostList {
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
    sort: [{frontmatter: {date: DESC}}, {frontmatter: {category: DESC}}, {frontmatter: {tags: ASC}}, {frontmatter: {title: ASC}}]
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
  allFile {
    edges {
      node {
        name
        publicURL
        childImageSharp {
          gatsbyImageData(width: 768, height: 400)
        }
      }
    }
  }
}`;

export default IndexPage;
