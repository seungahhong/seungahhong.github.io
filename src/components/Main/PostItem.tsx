import React, { FunctionComponent } from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { PostFrontmatterType } from 'types/PostItem';

type PostItemProps = PostFrontmatterType & { link: string };

const PostItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  transition: 0.3s box-shadow;
  cursor: pointer;
  min-height: 220px;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
`;

const PostItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

const Title = styled.div`
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 3px;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 20px;
  font-weight: 700;
`;

const Date = styled.div`
  font-size: 14px;
  font-weight: 400;
  opacity: 0.7;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  margin: 10px -5px;
`;

const TagItem = styled.div`
  margin: 2.5px 5px;
  padding: 3px 5px;
  border-radius: 3px;
  background: black;
  font-size: 14px;
  font-weight: 700;
  color: white;
`;

const ThumbnailImage = styled(GatsbyImage)`
  width: 100%;
  height: 200px;
  border-radius: 10px 10px 0 0;
  object-fit: cover;
  border-bottom: 1px solid #2d2d2d;
`;

const PostItem: FunctionComponent<PostItemProps> = function ({
  title,
  date,
  category,
  thumbnail: {
    childImageSharp: { gatsbyImageData },
  },
  tags,
  link,
}) {
  return (
    <PostItemWrapper to={link}>
      <ThumbnailImage image={gatsbyImageData} alt="Post Item Image" />
      <PostItemContent>
        <Title>{title}</Title>
        <Date>{date}</Date>
        <Tags>
          {tags.map(tag => (
            <TagItem key={tag}>{tag}</TagItem>
          ))}
        </Tags>
      </PostItemContent>
    </PostItemWrapper>
  );
};

export default PostItem;
