import { FunctionComponent, ReactNode, useContext, useEffect } from 'react';
import styled from 'styled-components';

import { GlobalStyle } from './config/theme';
import 'react-dropdown/style.css';
import 'react-accessible-accordion/dist/fancy-example.css';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreContext, StoreProvider } from './hooks/useStore';

const Wrapper = styled(StoreProvider)``;

export type AppProps = {
  children: ReactNode;
};

export const App = ({ children }: AppProps) => {
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
