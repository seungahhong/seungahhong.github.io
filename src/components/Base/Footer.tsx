import { FunctionComponent } from 'react';
import styled from 'styled-components';

type FooterProps = {
  isVisibleHeader?: boolean;
};

const FooterWrapper = styled.div<FooterProps>`
  display: grid;
  place-items: center;
  margin-top: auto;
  margin-left: ${props => (props.isVisibleHeader ? '20%' : '0')};
  padding: 50px 0;
  font-size: 15px;
  text-align: center;
  line-height: 1.5;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const Footer: FunctionComponent<FooterProps> = ({ isVisibleHeader }) => {
  return (
    <FooterWrapper isVisibleHeader={isVisibleHeader}>
      Thank You for Visiting My Blog,
      <br />© 2021 Developer SeungAh, Powered By Gatsby.
    </FooterWrapper>
  );
};

export default Footer;
