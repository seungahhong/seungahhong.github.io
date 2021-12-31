import React, { FunctionComponent } from 'react';
import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
  ${normalize}
  @import url('<https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap>');

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Nanum Myeongjo', serif;
  }

  html,
  body,
  #___gatsby {
    height: 100%;
  }

  a,
  a:hover {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  // Utterances 댓글 작성 라이브러리 스타일 지정
  .utterances {
    max-width: 1024px;
  }
`;

export default GlobalStyle;
