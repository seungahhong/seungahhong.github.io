import { FunctionComponent } from 'react';
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

const Container = styled.div`
  display: flex;
  margin-top: 80px;
  margin-left: 20%;
  flex-direction: column;
  overflow: auto;
  height: 100%;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const Content = styled.div`
  & h2 {
    font-size: 40px;
  }

  & ul {
    & > li {
      margin-left: 20px;
      margin-top: 8px;
      font-size: 20px;

      & > span {
        display: inline-block;
        width: 80px;
      }
    }
  }

  margin: 0 120px;

  @media (max-width: 1024px) {
    margin: 0 20px;
  }

  @media (max-width: 414px) {
    & h2 {
      font-size: 30px;
    }

    & ul {
      & > li {
        font-size: 14px;

        & > span {
          display: inline-block;
          width: 45px;
        }
      }
    }
  }
`;

const Section = styled.section`
  padding: 20px 0 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Anchor = styled.a`
  margin-left: 12px;
  color: #0687f0;
  text-decoration: none;
  box-shadow: none;
  word-break: break-all;
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
      isVisibleHeader
    >
      <Container>
        <Content>
          <Section>
            <h2>홍승아</h2>
            <ul>
              <li>FrontEnd 기술에 관심이 많은 개발자입니다.</li>
              <li>컴포넌트의 공통화, 확장성을 항상 고민하는 개발자입니다.</li>
              <li>
                개인만의 발전이 아닌 공동체가 발전할 수 있는 생태계(공유)를
                만들고 싶은 개발자입니다.
              </li>
            </ul>
          </Section>
          <Section>
            <h2>Skill Interested in</h2>
            <ul>
              <li>Javascript</li>
              <li>React</li>
              <li>Typescript</li>
              <li>C,C++</li>
            </ul>
          </Section>
          <Section>
            <h2>Link</h2>
            <ul>
              <li>
                <span>GitHub:</span>
                <Anchor href="https://github.com/seungahhong" target="_blank">
                  https://github.com/seungahhong
                </Anchor>
              </li>
              <li>
                <span>portfolio:</span>
                <Anchor
                  href="https://seungahhong-portfolio.vercel.app/"
                  target="_blank"
                >
                  https://seungahhong-portfolio.vercel.app/
                </Anchor>
              </li>
              <li>
                <span>Contact:</span>
                <Anchor href="mailto:gmm117@naver.com">gmm117@naver.com</Anchor>
              </li>
            </ul>
          </Section>
        </Content>
      </Container>
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
