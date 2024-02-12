import { FunctionComponent, MouseEvent } from 'react';
import * as React from 'react';
import styled from 'styled-components';

type PostFilterItemProps = {
  active: boolean;
  handleFilterClick: () => void;
  scrollHorzCenter: (event: MouseEvent) => void;
  children: React.ReactNode;
};

const PostItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  margin: 0.1em 12px 0.1em 0;
  padding: 8px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 700;
  background-color: ${props =>
    props.$active ? '#030303' : 'rgba(0, 0, 0, 0.05)'};
  border: ${props =>
    props.$active ? '1px solid #343a40' : '1px solid rgba(0, 0, 0, 0.1)'};
  color: ${props =>
    props.$active ? '#ffffff' : '1px solid rgba(0, 0, 0, 0.05)'};
`;

const PostFilterItem: FunctionComponent<PostFilterItemProps> = ({
  active,
  handleFilterClick,
  scrollHorzCenter,
  children,
}) => {
  return (
    <PostItem
      onClick={(event: MouseEvent) => {
        handleFilterClick();
        scrollHorzCenter(event);
      }}
      $active={active}
    >
      {children}
    </PostItem>
  );
};

export default PostFilterItem;
