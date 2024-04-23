import { useContext } from 'react';
import Header from '../components/header/Header';

import styled from 'styled-components';

import Send from '../components/transact/Send';
import TrxHistory from '../components/transaction-history/TrxHistory';
import { defaultSnapOrigin } from '../config';
import { MetaMaskContext } from '../hooks';
import { isLocalSnap } from '../utils';
import Transact from '../components/transact';
import { ReactComponent as Logo } from '../assets/logo.svg';

const AppWrapper = styled.div`
  padding: 24px;
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .float-logo {
    position: absolute;
    width: 630px;
    top: 0;
    left: 0;
    opacity: 0.1;
    z-index: -1;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  return (
    <AppWrapper>
      <Logo className="float-logo" />
      {isMetaMaskReady ? <Header /> : <></>}
      {state.installedSnap ? (
        <div className="flex">
          <Transact />
          {/* <Send /> */}
          <TrxHistory />
        </div>
      ) : (
        'Loading'
      )}
    </AppWrapper>
  );
};

export default Index;
