import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import Template from 'components/Base/Template';
import styled from 'styled-components';

type AboutPageProps = {
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
  };
};

const AboutWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  & > h4 {
    font-size: 30px;
  }
`;

const AboutPage: FunctionComponent<AboutPageProps> = ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl, social },
    },
  },
}) => {
  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      social={social}
    >
      <AboutWrapper>
        <h4>Thank you for reading my skill blog</h4>
      </AboutWrapper>
    </Template>
  );
};

export const getAbout = graphql`
  query getAbout {
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
  }
`;

export default AboutPage;
