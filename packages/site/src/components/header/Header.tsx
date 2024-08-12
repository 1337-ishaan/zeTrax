import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../hooks/useStore';
import styled from 'styled-components/macro';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { MetaMaskContext } from '../../hooks';
import {
  connectSnap,
  createBtcWallet,
  disconnectSnap,
  setLocalStorage,
} from '../../utils';
import StyledButton from '../utils/StyledButton';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import { ethers } from 'ethers';
import Copyable from '../utils/Copyable';
import { ReactComponent as BitcoinLogo } from '../../assets/bitcoin.svg';
import { ReactComponent as ZetaLogo } from '../../assets/zetachain.svg';

const HeaderWrapper = styled(FlexRowWrapper)`
  justify-content: space-between;
  padding: 32px 0;
  .logo {
    height: 40px;
    width: 40px;
  }
  .address-header {
    align-items: center;
    column-gap: 24px;
    height: fit-content;
  }
  .icon-addr-wrapper {
    position: relative;
    .chain-icon {
      position: absolute;
      top: -4px;
      left: -12px;
      transform: scale(1.4);
      opacity: 0.3;
    }
  }
`;

interface HeaderProps {}

const Header = ({}: HeaderProps): JSX.Element => {
  const [state] = useContext(MetaMaskContext);
  const { globalState, setGlobalState } = useContext(StoreContext);

  useEffect(() => {
    // Save the global state to localStorage when it changes
    if (globalState?.evmAddress && globalState?.btcAddress) {
      setLocalStorage('zeta-snap', JSON.stringify(globalState));
    }
  }, [globalState]);

  // Get EVM address
  const getEvmAddress = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const connectedAddress = await provider.getSigner();
    return connectedAddress.address;
  };

  // Connect to the Zeta snap
  const onConnectSnap = async () => {
    try {
      await connectSnap();
      const evmAddress = await getEvmAddress();
      const btcAddress = await createBtcWallet();

      if (evmAddress && btcAddress) {
        setGlobalState({ ...globalState, btcAddress, evmAddress });
      }
    } catch (e) {
      console.error('Error connecting to Zeta snap:', e);
    }
  };

  // Disconnect from the Zeta snap
  const onDisconnectSnap = async () => {
    try {
      await disconnectSnap();
      setGlobalState({});
      localStorage.removeItem('zeta-snap');
    } catch (e) {
      console.error('Error disconnecting from Zeta snap:', e);
    }
  };

  return (
    <HeaderWrapper>
      <Logo className="logo" />
      <div className="connect-wallet-wrapper">
        {state.installedSnap ? (
          <FlexRowWrapper>
            {!globalState?.btcAddress ? (
              <StyledButton onClick={onConnectSnap}>
                Connect ZeSnap
              </StyledButton>
            ) : (
              <FlexRowWrapper className="address-header">
                <div className="icon-addr-wrapper">
                  <BitcoinLogo className="chain-icon" />
                  <Copyable>{globalState?.btcAddress}</Copyable>
                </div>

                <div className="icon-addr-wrapper">
                  <ZetaLogo className="chain-icon" />
                  <Copyable>{globalState?.evmAddress}</Copyable>
                </div>
                <StyledButton onClick={onDisconnectSnap}>
                  Disconnect
                </StyledButton>
              </FlexRowWrapper>
            )}
          </FlexRowWrapper>
        ) : (
          <StyledButton onClick={onConnectSnap}>Install zeTrax</StyledButton>
        )}
      </div>
    </HeaderWrapper>
  );
};

export default Header;
