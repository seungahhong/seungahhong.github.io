import { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';
import { PostListItemType } from 'types/PostItem';
import useScrollAlign from '../../helpers/hooks/useScrollAlign';
import PostFilterItem from './PostFilterItem';

type PostFilterProps = {
  type: string;
  posts: PostListItemType[];
  filter: string;
  handleFilter: (type: string, filter: string) => void;
};

const PostFilterContainer = styled.section`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;
  margin-left: 16px;
  padding: 8px 0;
  width: 20%;
  height: calc(100vh);
  overflow: auto;

  & > h3 {
    color: #888;
    margin-bottom: 12px;
  }

  h3:nth-child(3) {
    margin-top: 32px;
  }
`;

const PostFilterList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
`;

const PostAsideFilter: FunctionComponent<PostFilterProps> = ({
  type,
  posts,
  filter,
  handleFilter,
}) => {
  const {
    ref: containerCategoryRef,
    handleScrollHorzCenter: categoryScrollHorzCenter,
  } = useScrollAlign();
  const {
    ref: containerTagsRef,
    handleScrollHorzCenter: cateroryScrollHorzCenter,
  } = useScrollAlign();

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
      <h3>카테고리</h3>
      <PostFilterList ref={containerCategoryRef}>
        <PostFilterItem
          handleFilterClick={() => handleFilter('CATEGORY', 'ALL')}
          active={type === 'CATEGORY' && filter === 'ALL'}
          scrollHorzCenter={categoryScrollHorzCenter}
        >
          ALL
        </PostFilterItem>
        {categories.map((category, index) => {
          return (
            <PostFilterItem
              key={`PostAsideFilterTagsCategory_${index}`}
              handleFilterClick={() =>
                handleFilter('CATEGORY', category.node.frontmatter.category)
              }
              active={
                type === 'CATEGORY' &&
                filter === category.node.frontmatter.category
              }
              scrollHorzCenter={categoryScrollHorzCenter}
            >
              {category.node.frontmatter.category}
            </PostFilterItem>
          );
        })}
      </PostFilterList>
      <h3>태그</h3>
      <PostFilterList ref={containerTagsRef}>
        <PostFilterItem
          handleFilterClick={() => handleFilter('TAGS', 'ALL')}
          active={type === 'TAGS' && filter === 'ALL'}
          scrollHorzCenter={cateroryScrollHorzCenter}
        >
          ALL
        </PostFilterItem>
        {tags.map((tag, index) => {
          return (
            <PostFilterItem
              key={`PostAsideFilterTagsAll_${index}`}
              handleFilterClick={() => handleFilter('TAGS', tag)}
              active={type === 'TAGS' && filter === tag}
              scrollHorzCenter={cateroryScrollHorzCenter}
            >
              {tag}
            </PostFilterItem>
          );
        })}
      </PostFilterList>
    </PostFilterContainer>
  );
};

export default PostAsideFilter;
