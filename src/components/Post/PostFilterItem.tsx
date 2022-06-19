import React, { FunctionComponent, useRef } from 'react';
import styled from 'styled-components';

type PostFilterItemProps = {
  active: boolean;
  handleFilterClick: (filter: string) => void;
  scrollHorzCenter: (tabRef: React.RefObject<HTMLElement>) => void;
  children: React.ReactChildren | React.ReactNode;
};

type PostProps = {
  active: boolean;
};

const PostItem = styled.li<PostProps>`
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

const PostFilterItem: FunctionComponent<PostFilterItemProps> = ({
  active,
  handleFilterClick,
  scrollHorzCenter,
  children,
}) => {
  const currentRef = useRef(null);
  const handleClick = (filter: string) => {
    handleFilterClick(filter);
    scrollHorzCenter(currentRef);
  };

  return (
    <PostItem
      ref={currentRef}
      onClick={() => handleClick('ALL')}
      active={active}
    >
      {children}
    </PostItem>
  );
};

export default PostFilterItem;
