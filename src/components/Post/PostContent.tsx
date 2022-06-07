import useScrollSpy from '../../helpers/hooks/useScrollSpy';
import React, { FunctionComponent, useRef } from 'react';
import styled from 'styled-components';
import CommentWidget from './CommentWidget';

interface PostContentProps {
  html: string;
  tableOfContents: string;
}

const PostWrapper = styled.div`
  display: flex;
  position: relative;
  padding: 100px 0;
  margin: 0 auto;
  align-items: start;

  @media (max-width: 1024px) {
    margin: 0;
  }
`;

const PostContentWrapper = styled.div`
  width: 80%;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const TocRenderer = styled.aside`
  display: inline-block;
  margin-left: 10px;
  position: sticky;
  top: 0;
  left: 10px;
  transition: all 0.125s esse-in 0s;
  color: rgba(0, 0, 0, 0.4);
  padding: 0 0.75rem;
  border-left: 2px solid gray;

  & ul {
    list-style: none;

    & li {
      margin-top: 5px;

      & a.reach {
        color: #000000;
        transform: scale(1.05);
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
  word-break: break-all;
  margin-bottom: 350px;
  padding: 0 80px;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 0 20px;
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
    margin-top: 20px;
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

  summary {
    font-size: 24px;
  }
`;

const PostContent: FunctionComponent<PostContentProps> = function ({
  html,
  tableOfContents,
}) {
  const tocRef = useRef<HTMLElement>(null);
  const markdownRef = useRef<HTMLElement>(null);
  useScrollSpy(tocRef, markdownRef);

  return (
    <>
      <PostWrapper>
        <PostContentWrapper>
          <MarkdownRenderer
            ref={markdownRef}
            dangerouslySetInnerHTML={{ __html: html }}
          />
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
