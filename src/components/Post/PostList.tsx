import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import PostItem from './PostItem';
import { PostListItemType } from 'types/PostItem';

type PostListProps = {
  posts: PostListItemType[];
};

const PostListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  margin-top: 20px;
  padding-bottom: 100px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostList: FunctionComponent<PostListProps> = ({ posts }) => {
  return (
    <PostListWrapper>
      {posts.map(
        ({
          node: {
            id,
            fields: { slug: link },
            frontmatter,
          },
        }: PostListItemType) => (
          <PostItem {...frontmatter} link={link} key={id} />
        ),
      )}
    </PostListWrapper>
  );
};

export default PostList;
