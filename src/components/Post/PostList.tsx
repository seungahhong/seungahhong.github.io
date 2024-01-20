import { FunctionComponent } from 'react';
import styled from 'styled-components';
import PostItem from './PostItem';
import { PostListItemType } from 'types/PostItem';
import useInfinityScroll from '../../helpers/hooks/useInfinityScroll';

type PostListProps = {
  posts: PostListItemType[];
  INIT_PER_PAGE_NUMBER: number;
};

const PostListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  padding-bottom: 80px;

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

const PostList: FunctionComponent<PostListProps> = ({
  posts,
  INIT_PER_PAGE_NUMBER,
}) => {
  const [currentRef, currentPosts] = useInfinityScroll(
    posts,
    INIT_PER_PAGE_NUMBER,
  );

  return (
    <PostListWrapper>
      {currentPosts.map(
        ({
          node: {
            id,
            fields: { slug: link },
            frontmatter,
            excerpt,
          },
        }: PostListItemType) => (
          <PostItem {...frontmatter} excerpt={excerpt} link={link} key={id} />
        ),
      )}
      <div ref={currentRef} />
    </PostListWrapper>
  );
};

export default PostList;
