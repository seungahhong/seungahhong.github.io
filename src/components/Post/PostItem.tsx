import { FunctionComponent } from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { PostFrontmatterType } from 'types/PostItem';

type PostItemProps = PostFrontmatterType & { link: string } & {
  excerpt: string;
};

const PostItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  transition: 0.3s box-shadow;
  cursor: pointer;

  @media (min-width: 1024px) {
    border: none;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);

    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
  }
`;

const PostItemContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
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

const ThumbnailImageWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #2d2d2d;

  &:before {
    display: block;
    padding-top: calc(9 / 16 * 100%);
    content: '';
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ThumbnailImage = styled(GatsbyImage)`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  border-radius: 10px 10px 0 0;
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
      <ThumbnailImageWrapper>
        <ThumbnailImage
          image={gatsbyImageData}
          alt="Post Item Image"
          objectFit="cover"
        />
      </ThumbnailImageWrapper>
      <PostItemContent>
        <Title>{title}</Title>
        <Date>{date}</Date>
        <Summary>{excerpt}</Summary>
      </PostItemContent>
    </PostItemWrapper>
  );
};

export default PostItem;
