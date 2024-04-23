import styled from 'styled-components/macro';
import StyledButton from '../utils/StyledButton';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import {
  connectSnap,
  createBtcWallet,
  getBtcUtxo,
  getWalletInfo,
  getZetaBalance,
} from '../../utils';
import useAccount from '../../hooks/useAccount';
import Copyable from '../utils/Copyable';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MetaMaskContext } from '../../hooks';
import Typography from '../utils/Typography';
import Balances from '../balances/Balances';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  .connect-wallet-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    column-gap: 8px;
    color: #fff;
  }
  .address-text {
    font-size: 16px;
    /* font-family: 'Sans'; */
  }
  .addr-type {
    font-size: 16px;
  }
  .balance-text {
    font-size: 16px;
    padding: 12px 12px 12px 0;
  }
  .logo {
    height: 40px;
    width: 40px;
  }
`;

interface HeaderProps {}

const Header = ({}: HeaderProps): JSX.Element => {
  const [state] = useContext(MetaMaskContext);

  const { address } = useAccount(!!state.installedSnap);

  // const onCreateBtcAddr = async () => {
  //   await createBtcWallet();
  // };
  const onConnectSnap = async () => {
    await connectSnap();
    await createBtcWallet();
  };

  return (
    <HeaderWrapper>
      <Logo className="logo" />
      <div className="connect-wallet-wrapper">
        {state.installedSnap || address ? (
          <StyledButton onClick={onConnectSnap}>Disconnect</StyledButton> // TODO: Add disconnection logic
        ) : (
          <StyledButton onClick={onConnectSnap}>Install zeTrax</StyledButton>
        )}
      </div>
    </HeaderWrapper>
  );
};

export default Header;
