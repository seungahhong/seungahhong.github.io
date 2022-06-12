import React, { FunctionComponent } from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { useIsMobile } from '../../helpers/hooks/useMedia';
import { PostFrontmatterType } from 'types/PostItem';

type PostItemProps = PostFrontmatterType & { link: string } & {
  excerpt: string;
};

const PostItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  transition: 0.3s box-shadow;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
`;

const PostItemContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 15px;
  word-break: break-word;
`;

const Title = styled.h3`
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 8px;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 24px;
  font-weight: 700;
`;

const Date = styled.p`
  font-size: 14px;
  font-weight: 400;
  opacity: 0.7;
`;

const ThumbnailImage = styled(GatsbyImage)`
  width: 100%;
  height: 250px;
  border-radius: 10px 10px 0 0;
  object-fit: cover;
  border-bottom: 1px solid #2d2d2d;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Summary = styled.p`
  margin-top: 8px;
  font-weight: 500;
`;

const PostItem: FunctionComponent<PostItemProps> = function ({
  title,
  date,
  thumbnail: {
    childImageSharp: { gatsbyImageData },
  },
  excerpt,
  link,
}) {
  return (
    <PostItemWrapper to={link}>
      <ThumbnailImage
        image={gatsbyImageData}
        alt="Post Item Image"
        objectFit="contain"
      />
      <PostItemContent>
        <Title>{title}</Title>
        <Date>{date}</Date>
        <Summary>{excerpt}</Summary>
      </PostItemContent>
    </PostItemWrapper>
  );
};

export default PostItem;
