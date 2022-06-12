import React, { FunctionComponent, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import GlobalStyle from './GlobalStyle';

type TemplateProps = {
  title: string;
  description: string;
  url: string;
  isVisibleHeader?: boolean;
  social: {
    facebook: string;
    github: string;
    notion: string;
    linkedin: string;
  };
  children: ReactNode;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Template: FunctionComponent<TemplateProps> = function ({
  title,
  description,
  url,
  social,
  isVisibleHeader,
  children,
}) {
  return (
    <Container>
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={title} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="seungah.hong" />
        <meta name="twitter:creator" content="seungah.hong" />

        <meta
          name="google-site-verification"
          content="DafIPWtLpIjdEIuERhMFfutDl2IoaF8b6CQTBYF6qsQ"
        />
        <meta
          name="naver-site-verification"
          content="ab246841529a97bcf76ac7ed42d5a5c457a381bc"
        />
      </Helmet>
      <GlobalStyle />
      {isVisibleHeader && <Header social={social} />}
      {children}
      <Footer isVisibleHeader={isVisibleHeader} />
    </Container>
  );
};

export default Template;
