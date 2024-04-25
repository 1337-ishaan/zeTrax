import type { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { GlobalStyle } from './config/theme';
import 'react-dropdown/style.css';
import 'react-accessible-accordion/dist/fancy-example.css';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5% 160px;
  box-shadow: 0px 0px 40px 16px rgba(0, 0, 0, 1);
  border-radius: ${(props) => props.theme.borderRadius};
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  return (
    <>
      <ToastContainer
        theme="dark"
        position="top-center"
        transition={Slide}
        hideProgressBar
      />
      <GlobalStyle />
      <Wrapper>{children}</Wrapper>
    </>
  );
};
