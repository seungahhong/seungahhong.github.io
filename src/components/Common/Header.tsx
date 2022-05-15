import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

type HeaderImageNodeType = {
  node: {
    name: string;
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
    publicURL: string;
  };
};

type HeaderImageType = {
  allFile: {
    edges: HeaderImageNodeType[];
  };
};

type SocialImageType = {
  size: number;
};

const HeaderWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20%;
`;

const HeaderImage = styled(GatsbyImage)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    to bottom,
    rgba(22, 27, 33, 0) 0,
    rgba(22, 27, 33, 0.01) 1%,
    rgba(22, 27, 33, 0.7) 70%,
    rgba(22, 27, 33, 0.7) 100%
  );
`;

const HeaderContent = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 60px 30px 52px;
  color: #fff;

  & > h4 {
    font-size: 35px;
  }

  & > p {
    margin-top: 10px;
    font-size: 24px;
  }
`;

const HeaderMenu = styled.div`
  margin-top: 30px;

  & > ul {
    list-style: none;
    font-size: 20px;
    line-height: 1.6;

    & > li {
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const HeaderSocialWrapper = styled.div`
  display: flex;
  margin-top: 36px;
`;

const HeaderSocialLink = styled(Link)<SocialImageType>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background: rgba(255, 255, 255, 0.7);
  color: #161b21;
  width: 40px;
  height: 40px;
  font-size: 20px;
  border: none;
  border-radius: 50%;

  & > img {
    width: ${props => `${props.size}px`};
    height: ${props => `${props.size}px`};
  }
`;

const Header: FunctionComponent = () => {
  const {
    allFile: { edges },
  } = useStaticQuery<HeaderImageType>(graphql`
    query {
      allFile(
        filter: {
          extension: { regex: "/(jpg)|(jpeg)|(png)|(svg)/" }
          relativeDirectory: { eq: "images/header" }
        }
      ) {
        edges {
          node {
            name
            publicURL
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  `);

  const backgroundImage = useMemo(() => {
    return edges.find(item => item.node?.name === 'background');
  }, [edges]);

  const facebookImage = useMemo(() => {
    return edges.find(item => item.node?.name === 'facebook');
  }, [edges]);

  const githubImage = useMemo(() => {
    return edges.find(item => item.node?.name === 'github');
  }, [edges]);

  const notionImage = useMemo(() => {
    return edges.find(item => item.node?.name === 'notion');
  }, [edges]);

  return (
    <HeaderWrapper>
      {backgroundImage && (
        <>
          <HeaderImage
            image={backgroundImage.node.childImageSharp.gatsbyImageData}
            alt=""
            objectFit="cover"
          />
          <HeaderOverlay aria-hidden="true" />
        </>
      )}
      <HeaderContent>
        <h4>홍승아</h4>
        <h4>기술블로그</h4>
        <p>Front-End Developer</p>
        <HeaderMenu>
          <ul>
            <li>
              <Link to="/">Blog</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </HeaderMenu>
        <HeaderSocialWrapper>
          {facebookImage && (
            <HeaderSocialLink to="https://github.com/seungahhong" size={32}>
              <img src={facebookImage.node.publicURL} alt="" />
            </HeaderSocialLink>
          )}
          {githubImage && (
            <HeaderSocialLink to="https://github.com/seungahhong" size={40}>
              <img src={githubImage.node.publicURL} alt="" />
            </HeaderSocialLink>
          )}
          {notionImage && (
            <HeaderSocialLink
              to="https://material-debt-c1c.notion.site/daa60481e37840ea9e1b7e1b12269942"
              size={30}
            >
              <img src={notionImage.node.publicURL} alt="" />
            </HeaderSocialLink>
          )}
        </HeaderSocialWrapper>
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;
