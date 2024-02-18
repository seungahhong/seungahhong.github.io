import { FunctionComponent, useMemo } from 'react';
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
  margin-bottom: 20px;
  padding: 8px 0;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
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
  const { ref: containerRef, handleScrollHorzCenter: scrollHorzCenter } =
    useScrollAlign();

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
        <PostFilterItem
          handleFilterClick={() => handleFilter('tag', 'ALL')}
          active={filter === 'ALL'}
          scrollHorzCenter={scrollHorzCenter}
        >
          ALL
        </PostFilterItem>
        {tags.map((tag, index) => {
          return (
            <PostFilterItem
              key={`PostHeadTagFilterTags_${index}`}
              handleFilterClick={() => handleFilter('tag', tag)}
              active={filter === tag}
              scrollHorzCenter={scrollHorzCenter}
            >
              {tag}
            </PostFilterItem>
          );
        })}
      </PostFilterList>
    </PostFilterContainer>
  );
};

export default PostHeadTagFilter;
