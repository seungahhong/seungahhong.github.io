import React, { FunctionComponent, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { PostListItemType } from 'types/PostItem';
import useScrollAlign from '../../helpers/hooks/useScrollAlign';
import PostFilterItem from './PostFilterItem';

type PostFilterProps = {
  posts: PostListItemType[];
  filter: string;
  handleFilter: (type: string, filter: string) => void;
};

const PostFilterContainer = styled.section`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;
  margin-bottom: 20px;
  padding: 8px 0;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
`;

const PostFilterList = styled.ul`
  display: flex;
  padding: 0 4px;
  overflow-x: auto;
  list-style: none;
`;

const PostHeadTagFilter: FunctionComponent<PostFilterProps> = ({
  posts,
  filter,
  handleFilter,
}) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const [scrollHorzCenter] = useScrollAlign(containerRef);

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
      <PostFilterList ref={containerRef}>
        {tags.map((tag, index) => {
          return (
            <>
              {index === 0 && (
                <PostFilterItem
                  key={`TAGSALL_${index}`}
                  handleFilterClick={() => handleFilter('tag', 'ALL')}
                  active={filter === 'ALL'}
                  scrollHorzCenter={scrollHorzCenter}
                >
                  ALL
                </PostFilterItem>
              )}
              <PostFilterItem
                key={`TAGS_${index}`}
                handleFilterClick={() => handleFilter('tag', tag)}
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

export default PostHeadTagFilter;