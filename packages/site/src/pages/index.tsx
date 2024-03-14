import { useContext } from 'react';
import Header from '../components/header/Header';

import styled from 'styled-components';

import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  demonstrateCctx,
  shouldDisplayReconnectButton,
  getWalletInfo,
  createBtcWallet,
  getBtcUtxo,
  getBtcActivity,
  sendBtc,
} from '../utils';
import TrxHistory from '../components/transaction-history/TrxHistory';
import Send from '../components/transact/Send';
import Receive from '../components/transact/Receive';

const AppWrapper = styled.div`
  .flex {
    display: flex;
    padding: 40px;

    justify-content: space-between;
  }
`;
const Container = styled.div`
  display: flex;
  padding: 40px 80px;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  return (
    <AppWrapper>
      {/* <button onClick={async () => await sendBtc()}>send btc</button> */}
      <Header />
      <div className="flex">
        <Send />
        <TrxHistory />
      </div>
    </AppWrapper>
  );
};

export default Index;
