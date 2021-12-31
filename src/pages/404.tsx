import * as React from 'react';
import styled from 'styled-components';

import SEO from '../components/seo';

const NotFoundPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
  height: 100vh;
`;

const NotFoundPage = () => (
  <NotFoundPageWrapper>
    <SEO title="404: Not found" />
    <h1>404: Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </NotFoundPageWrapper>
);

export default NotFoundPage;
