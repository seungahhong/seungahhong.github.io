import React, { FunctionComponent, useMemo, useState } from 'react';
import styled from 'styled-components';
import { PostListItemType } from 'types/PostItem';

type PostFilterProps = {
  posts: PostListItemType[];
  type: string;
  filter: string;
  handleType: (type: string) => void;
  handleFilter: (filter: string) => void;
};

type PostProps = {
  active: boolean;
};

const PostFilterContainer = styled.section`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;
  padding-top: 18px;

  & ul {
    overflow-x: auto;
    list-style: none;
  }
`;

const PostList = styled.ul`
  display: flex;
  border: 1px solid #adb5bd;
  padding: 6px 20px;
  border-radius: 12px;
  margin-top: 8px;

  // overflow-x: scroll;
  // scrollbar-height: none; /* Firefox */
  // &::-webkit-scrollbar {
  //   display: none; /* Chrome, Safari, Opera*/
  // }
`;

const PostListItem = styled.li<PostProps>`
  display: flex;
  align-items: center;
  margin: 0.1em 12px 0.1em 0;
  padding: 8px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 700;
  background-color: ${props =>
    props.active ? '#030303' : 'rgba(0, 0, 0, 0.05)'};
  border: ${props =>
    props.active ? '1px solid #343a40' : '1px solid rgba(0, 0, 0, 0.1)'};
  color: ${props =>
    props.active ? '#ffffff' : '1px solid rgba(0, 0, 0, 0.05)'};
`;

const PostFilterButton = styled.button<PostProps>`
  display: inline-block;
  margin: 0 4px;
  padding: 8px 12px;
  background-color: ${props =>
    props.active ? '#030303' : 'rgba(0, 0, 0, 0.05)'};
  border: ${props =>
    props.active ? '1px solid #343a40' : '1px solid rgba(0, 0, 0, 0.1)'};
  color: ${props =>
    props.active ? '#ffffff' : '1px solid rgba(0, 0, 0, 0.05)'};
  border-radius: 15px;
  cursor: pointer;
  font-weight: 700;
`;

const PostFilter: FunctionComponent<PostFilterProps> = ({
  posts,
  type,
  filter,
  handleType,
  handleFilter,
}) => {
  const categories = useMemo(() => {
    return posts.filter(({ node: { frontmatter } }, index) => {
      return (
        posts.findIndex(
          item => item.node.frontmatter.category === frontmatter.category,
        ) === index
      );
    });
  }, [posts]);

  const tags = useMemo(() => {
    const datas = posts.reduce((acc, { node: { frontmatter } }) => {
      return [...acc, ...frontmatter.tags];
    }, [] as string[]);

    return datas.filter((data, index) => {
      return datas.indexOf(data) === index;
    });
  }, [posts]);

  return (
    <PostFilterContainer>
      <div>
        <PostFilterButton
          onClick={() => handleType('CATEGORY')}
          active={type === 'CATEGORY'}
        >
          CATEGORY
        </PostFilterButton>
        <PostFilterButton
          onClick={() => handleType('TAGS')}
          active={type === 'TAGS'}
        >
          TAGS
        </PostFilterButton>
      </div>
      <PostList>
        {type === 'CATEGORY' &&
          categories.map((category, index) => {
            return (
              <>
                {index === 0 && (
                  <PostListItem
                    onClick={() => handleFilter('ALL')}
                    active={filter === 'ALL'}
                  >
                    ALL
                  </PostListItem>
                )}
                <PostListItem
                  onClick={() =>
                    handleFilter(category.node.frontmatter.category)
                  }
                  active={filter === category.node.frontmatter.category}
                >
                  {category.node.frontmatter.category}
                </PostListItem>
              </>
            );
          })}
        {type === 'TAGS' &&
          tags.map((tag, index) => {
            return (
              <>
                {index === 0 && (
                  <PostListItem
                    onClick={() => handleFilter('ALL')}
                    active={filter === 'ALL'}
                  >
                    ALL
                  </PostListItem>
                )}
                <PostListItem
                  onClick={() => handleFilter(tag)}
                  active={filter === tag}
                >
                  {tag}
                </PostListItem>
              </>
            );
          })}
      </PostList>
    </PostFilterContainer>
  );
};

export default PostFilter;
