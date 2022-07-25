import React, { FunctionComponent, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import CommentWidget from './CommentWidget';
import useScrollSpy from '../../helpers/hooks/useScrollSpy';

interface PostContentProps {
  title: string;
  date: string;
  html: string;
  tableOfContents: string;
  pageContext: {
    previous?: {
      frontmatter: {
        title: string;
      };
      fields: {
        slug: string;
      };
    };
    next?: {
      frontmatter: {
        title: string;
      };
      fields: {
        slug: string;
      };
    };
    slug: string;
  };
  social: {
    facebook: string;
    github: string;
    notion: string;
    linkedin: string;
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
}

type SocialImageType = {
  size: number;
};

const PostWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  margin: 0 auto;
  align-items: start;
  max-width: 1024px;

  @media (max-width: 1024px) {
    margin: 0;
  }
`;

const PostHeadWrapper = styled.header`
  border-bottom: 1px solid #e6e6e6;

  & > div {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1024px;
    padding: 0 20px;

    @media (max-width: 1024px) {
      margin: 0;
      min-width: auto;
    }
  }

  & h1 {
    font-size: 24px;
    margin: 12px 0 8px;
  }
`;

const PostContentWrapper = styled.div`
  width: 80%;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const PostTitle = styled.div`
  padding: 0 20px;
  margin-bottom: 48px;

  & > h1 {
    margin-bottom: 8px;
    font-size: 40px;
  }
`;

const TocRenderer = styled.aside`
  display: inline-block;
  margin: 12px 0 0 10px;
  position: sticky;
  top: 0;
  left: 10px;
  transition: all 0.125s esse-in 0s;
  min-width: 200px;
  color: rgba(0, 0, 0, 0.4);
  padding: 0 0.75rem;
  border-left: 2px solid gray;

  & ul {
    list-style: none;

    & li {
      margin-top: 5px;

      & a {
        display: inline-block;
        &.reach {
          color: #000000;
          transform: scale(1.05);
        }
      }
    }
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MarkdownRenderer = styled.article`
  // Renderer Style
  display: flex;
  flex-direction: column;
  word-break: keep-all;
  margin-bottom: 250px;
  padding: 0 20px;
  width: 100%;

  @media (max-width: 1024px) {
    margin-bottom: 48px;
  }

  // Markdown Style
  line-height: 1.8;
  font-size: 16px;
  font-weight: 400;

  // Apply Padding Attribute to All Elements
  p {
    padding: 3px 0;
  }

  // Adjust Heading Element Style
  h1,
  h2,
  h3 {
    font-weight: 800;
  }

  * + h1 {
    margin-top: 60px;
  }

  * + h2 {
    margin-top: 40px;
  }

  * + h3 {
    margin-top: 30px;
  }

  hr + h1,
  hr + h2,
  hr + h3 {
    margin-top: 0;
  }

  h1 {
    font-size: 30px;
  }

  h2 {
    font-size: 25px;
  }

  h3 {
    font-size: 20px;
  }

  // Adjust Quotation Element Style
  blockquote {
    margin: 30px 0;
    padding: 5px 15px;
    border-left: 2px solid #000000;
    font-weight: 800;
  }

  // Adjust List Element Style
  ol,
  ul {
    margin-left: 20px;
    padding: 10px 0;
  }

  // Adjust Horizontal Rule style
  hr {
    border: 1px solid #000000;
    margin: 100px 0;
  }

  // Adjust Link Element Style
  a {
    color: #4263eb;
    text-decoration: underline;
  }

  // Adjust Code Style
  pre[class*='language-'] {
    margin: 30px 0;
    padding: 15px;
    font-size: 15px;

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 3px;
    }
  }

  code[class*='language-'],
  pre[class*='language-'] {
    tab-size: 2;
  }

  img {
    width: 100%;
  }

  summary {
    cursor: pointer;
    font-size: 24px;
  }
`;

const PostNavigator = styled.section`
  margin: 40px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0 20px;

  & h5 {
    font-size: 24px;
    margin-bottom: 8px;
  }

  & a {
    border-radius: 6px;
    font-size: 20px;
    color: #cc007a;
    font-weight: 700;
  }
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

const PostContent: FunctionComponent<PostContentProps> = function ({
  title,
  date,
  html,
  tableOfContents,
  pageContext,
  social,
  allFile: { edges },
}) {
  const tocRef = useRef<HTMLElement>(null);
  const markdownRef = useRef<HTMLElement>(null);
  useScrollSpy(tocRef, markdownRef);

  const githubImage = useMemo(() => {
    return edges.find(item => item.node?.name === 'github');
  }, [edges]);

  return (
    <>
      <PostHeadWrapper>
        <div>
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
            <img src={githubImage?.node.publicURL} alt="" />
          </SocialLink>
        </div>
      </PostHeadWrapper>
      <PostWrapper>
        <PostContentWrapper>
          <PostTitle>
            <h1>{title}</h1>
            <time>{date}</time>
          </PostTitle>
          <MarkdownRenderer
            ref={markdownRef}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {(pageContext.previous || pageContext.next) && (
            <PostNavigator>
              {pageContext.previous && (
                <Link to={pageContext.previous.fields.slug}>
                  <h5>이전글</h5>
                  <i>{'← '}</i>
                  {pageContext.previous.frontmatter.title}
                </Link>
              )}
              {pageContext.next && (
                <Link to={pageContext.next.fields.slug}>
                  <h5>다음글</h5>
                  {pageContext.next.frontmatter.title}
                  <i>{' →'}</i>
                </Link>
              )}
            </PostNavigator>
          )}
          <CommentWidget />
        </PostContentWrapper>
        <TocRenderer
          ref={tocRef}
          dangerouslySetInnerHTML={{ __html: tableOfContents }}
        />
      </PostWrapper>
    </>
  );
};

export default PostContent;
