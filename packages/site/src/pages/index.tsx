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
import Balances from '../components/balances/Balances';
import FlexColumnWrapper from '../components/utils/wrappers/FlexColumnWrapper';
import Disconnected from '../components/screen/Disconnected';

const AppWrapper = styled.div`
  padding: 0px 26px;
  .flex {
    display: flex;

    column-gap: 24px;
  }
  .float-logo {
    position: absolute;
    width: 630px;
    top: 0;
    left: 0;
    opacity: 0.1;
    z-index: -1;
  }
  .balances-transact-wrapper {
    column-gap: 64px;
    width: 50%;
    row-gap: 24px;
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
          <FlexColumnWrapper className="balances-transact-wrapper">
            <Transact />
            <TrxHistory />
          </FlexColumnWrapper>
          <Balances />
        </div>
      ) : (
        <Disconnected />
      )}
    </AppWrapper>
  );
};

export default Index;
