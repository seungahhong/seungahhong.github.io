import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #___gatsby {
    height: 100%;
    word-break: keep-all;
    overflow-wrap: break-word;
  }
  #gatsby-focus-wrapper {
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
    margin: 0 auto;
  }
`;

export default GlobalStyle;
