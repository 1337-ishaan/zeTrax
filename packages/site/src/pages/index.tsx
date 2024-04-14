import { useContext } from 'react';
import Header from '../components/header/Header';

import styled from 'styled-components';

import Send from '../components/transact/Send';
import TrxHistory from '../components/transaction-history/TrxHistory';
import { defaultSnapOrigin } from '../config';
import { MetaMaskContext } from '../hooks';
import { isLocalSnap } from '../utils';
// import Receive from '../components/transact/Receive';

const AppWrapper = styled.div`
  padding: 0 200px;
  .flex {
    display: flex;
    justify-content: space-between;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  return (
    <AppWrapper>
      {isMetaMaskReady ? <Header /> : <></>}
      {state.installedSnap ? (
        <div className="flex">
          <Send />
          <TrxHistory />
        </div>
      ) : (
        'Loading'
      )}
    </AppWrapper>
  );
};

export default Index;
