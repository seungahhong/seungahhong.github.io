import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';
import { PostListItemType } from 'types/PostItem';

type PostFilterProps = {
  filter: string;
  posts: PostListItemType[];
  onFilter: (filter: string) => void;
};

type PostItemProps = {
  active: boolean;
};

const PostListWrapper = styled.ul`
  display: flex;
  position: sticky;
  top: 0;
  overflow-x: auto;
  z-index: 1;
  list-style: none;
  margin-top: 20px;
  border: 1px solid #adb5bd;
  padding: 6px 20px;
  border-radius: 12px;
  background-color: #ffffff;

  // overflow-x: scroll;
  // scrollbar-height: none; /* Firefox */
  // &::-webkit-scrollbar {
  //   display: none; /* Chrome, Safari, Opera*/
  // }
`;

const PostListItem = styled.li<PostItemProps>`
  margin: 0.25rem 6px 0.25rem 0;
  border-radius: 15px;
  cursor: pointer;

  border: ${props =>
    props.active ? '1px solid #343a40' : '1px solid #e9ecef'};

  & > div {
    padding: 8px 12px;
  }
`;

const PostFilter: FunctionComponent<PostFilterProps> = ({
  filter,
  posts,
  onFilter,
}) => {
  const categorys = useMemo(() => {
    return posts.filter(({ node: { frontmatter } }, index) => {
      return (
        posts.findIndex(
          item => item.node.frontmatter.category === frontmatter.category,
        ) === index
      );
    });
  }, [posts]);

  return categorys.length > 0 ? (
    <PostListWrapper>
      {categorys.map((category, index) => {
        return (
          <>
            {index === 0 && (
              <PostListItem
                onClick={() => onFilter('ALL')}
                active={filter === 'ALL'}
              >
                <div>ALL</div>
              </PostListItem>
            )}
            <PostListItem
              onClick={() => onFilter(category.node.frontmatter.category)}
              active={filter === category.node.frontmatter.category}
            >
              <div>{category.node.frontmatter.category}</div>
            </PostListItem>
          </>
        );
      })}
    </PostListWrapper>
  ) : null;
};

export default PostFilter;
