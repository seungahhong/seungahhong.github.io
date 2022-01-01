import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import PostItem from './PostItem';
import { PostListItemType } from 'types/PostItem';

type PostListProps = {
  posts: PostListItemType[];
};

const PostListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  width: 1200px;
  margin: 0 auto;
  padding: 50px 0 100px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    width: 768px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
    padding: 50px 20px;
  }
`;

const PostList: FunctionComponent<PostListProps> = function ({ posts }) {
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
