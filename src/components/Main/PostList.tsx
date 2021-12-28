import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import PostItem from './PostItem';
import { PostListItemType } from 'types/PostItem';

type PostListProps = {
  posts: PostListItemType[];
};

const PostListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  width: 768px;
  margin: 0 auto;
  padding: 50px 0 100px;
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
