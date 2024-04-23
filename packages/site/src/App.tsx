import type { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { GlobalStyle } from './config/theme';
import 'react-dropdown/style.css';
import 'react-accessible-accordion/dist/fancy-example.css';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 160px;
  box-shadow: 0px 0px 21px 5px rgba(0, 0, 0, 1);
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <Wrapper>{children}</Wrapper>
    </>
  );
};
