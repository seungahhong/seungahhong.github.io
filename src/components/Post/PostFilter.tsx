import React, { FunctionComponent, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { PostListItemType } from 'types/PostItem';
import useScrollAlign from '../../helpers/hooks/useScrollAlign';
import PostFilterItem from './PostFilterItem';

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
  margin-top: 18px;
  padding: 8px 0;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
`;

const PostFilterList = styled.ul`
  display: flex;
  padding: 0 4px;
  margin-top: 8px;
  overflow-x: auto;
  list-style: none;

  // overflow-x: scroll;
  // scrollbar-height: none; /* Firefox */
  // &::-webkit-scrollbar {
  //   display: none; /* Chrome, Safari, Opera*/
  // }
`;

const PostFilterWrapper = styled.div`
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
  const containerRef = useRef<HTMLUListElement>(null);
  const [scrollHorzCenter] = useScrollAlign(containerRef);

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
      <PostFilterWrapper>
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
      </PostFilterWrapper>
      <PostFilterList ref={containerRef}>
        {type === 'CATEGORY' &&
          categories.map((category, index) => {
            return (
              <>
                {index === 0 && (
                  <PostFilterItem
                    key={`CATEGORYALL_${index}`}
                    handleFilterClick={filter => handleFilter(filter)}
                    active={filter === 'ALL'}
                    scrollHorzCenter={scrollHorzCenter}
                  >
                    ALL
                  </PostFilterItem>
                )}
                <PostFilterItem
                  key={`CATEGORY_${index}`}
                  handleFilterClick={() =>
                    handleFilter(category.node.frontmatter.category)
                  }
                  active={filter === category.node.frontmatter.category}
                  scrollHorzCenter={scrollHorzCenter}
                >
                  {category.node.frontmatter.category}
                </PostFilterItem>
              </>
            );
          })}
        {type === 'TAGS' &&
          tags.map((tag, index) => {
            return (
              <>
                {index === 0 && (
                  <PostFilterItem
                    key={`TAGSALL_${index}`}
                    handleFilterClick={() => handleFilter('ALL')}
                    active={filter === 'ALL'}
                    scrollHorzCenter={scrollHorzCenter}
                  >
                    ALL
                  </PostFilterItem>
                )}
                <PostFilterItem
                  key={`TAGS_${index}`}
                  handleFilterClick={() => handleFilter(tag)}
                  active={filter === tag}
                  scrollHorzCenter={scrollHorzCenter}
                >
                  {tag}
                </PostFilterItem>
              </>
            );
          })}
      </PostFilterList>
    </PostFilterContainer>
  );
};

export default PostFilter;
