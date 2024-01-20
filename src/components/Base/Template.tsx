import { FunctionComponent, ReactNode } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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

interface GatsbyImageType {
  file: {
    childImageSharp: {
      fluid: {
        src: string;
      };
    };
  };
}

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
  const {
    file: { childImageSharp },
  }: GatsbyImageType = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "images/main.png" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <title>{title}</title>

          <meta name="description" content={description} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={url} />
          <meta property="og:site_name" content={title} />
          <meta
            property="og:image"
            content={`${url}${childImageSharp.fluid.src}`}
          />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:site" content="seungah.hong" />
          <meta name="twitter:creator" content="seungah.hong" />
          <meta
            name="twitter:image"
            content={`${url}${childImageSharp.fluid.src}`}
          />

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
    </HelmetProvider>
  );
};

export default Template;
