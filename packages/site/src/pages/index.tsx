import { useContext } from 'react';
import Header from '../components/header/Header';
import styled from 'styled-components';
import TrxHistory from '../components/transaction-history/TrxHistory';
import { defaultSnapOrigin } from '../config';
import { MetaMaskContext } from '../hooks';
import { isLocalSnap} from '../utils';
import Transact from '../components/transact';
import { ReactComponent as Logo } from '../assets/logo.svg';
import Balances from '../components/balances/Balances';
import FlexColumnWrapper from '../components/utils/wrappers/FlexColumnWrapper';
import Disconnected from '../components/screen/Disconnected';
import FlexRowWrapper from '../components/utils/wrappers/FlexRowWrapper';
import { StoreContext } from '../hooks/useStore';

const AppWrapper = styled(FlexColumnWrapper)`
  padding: 16px 32px;
  margin: 0 auto;
  gap: 0 54px;

  .action-balances-wrapper {
    column-gap: 24px;
  }

  .page-bg-logo {
    position: absolute;
    width: 630px;
    top: 0;
    left: 0;
    opacity: 0.1;
    z-index: -1;
  }

  .trx-transact-wrapper {
    column-gap: 64px;
    row-gap: 24px;
  }
`;

const Index = () => {
  const [state] = useContext(MetaMaskContext);
  const { globalState } = useContext(StoreContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.installedSnap;

  return (
    <AppWrapper>
      <Logo className="page-bg-logo" />
      {isMetaMaskReady && <Header />}
      {!!globalState?.btcAddress ? (
        <FlexRowWrapper className="action-balances-wrapper">
          <FlexColumnWrapper className="trx-transact-wrapper">
            <Transact />
            <TrxHistory />
          </FlexColumnWrapper>
          <Balances />
        </FlexRowWrapper>
      ) : (
        <Disconnected />
      )}
    </AppWrapper>
  );
};

export default Index;
