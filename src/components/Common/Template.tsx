import React, { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import GlobalStyle from './GlobalStyle';

type TemplateProps = {
  children: ReactNode;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Template: FunctionComponent<TemplateProps> = function ({ children }) {
  return (
    <Container>
      <GlobalStyle />
      {children}
    </Container>
  );
};

export default Template;
