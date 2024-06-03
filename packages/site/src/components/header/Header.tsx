import { useContext, useEffect } from 'react';
import { StoreContext } from '../../hooks/useStore';
import styled from 'styled-components/macro';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { MetaMaskContext } from '../../hooks';
import { connectSnap, createBtcWallet, disconnectSnap } from '../../utils';
import StyledButton from '../utils/StyledButton';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import { ethers } from 'ethers';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0;
  .connect-wallet-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    column-gap: 8px;
    color: #fff;
  }
  .address-text {
    font-size: 16px;
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
  const { globalState, setGlobalState } = useContext(StoreContext);

  console.log(globalState, 'globalState');
  const onConnectSnap = async () => {
    await connectSnap();
    // await createBtcWallet();
  };

  useEffect(() => {
    if (!globalState.evmAddress) {
      const getEvmAddress = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const connectedAddress = await provider.getSigner();
        setGlobalState({
          ...globalState,
          evmAddress: connectedAddress.address,
        });
      };
      getEvmAddress();
    }
  }, [state.installedSnap]);

  const onDisconnectSnap = async () => {
    await disconnectSnap();
  };

  const onCreateBtcWallet = async () => {
    try {
      const btcAddress = await createBtcWallet();
      setGlobalState({ ...globalState, btcAddress });
    } catch {
      console.log('error');
    }
  };
  return (
    <HeaderWrapper>
      <Logo className="logo" />
      <div className="connect-wallet-wrapper">
        {state.installedSnap ? (
          <FlexRowWrapper>
            <StyledButton onClick={onDisconnectSnap}>Disconnect</StyledButton>
            <StyledButton onClick={onCreateBtcWallet}>
              Create BTC Wallet
            </StyledButton>
          </FlexRowWrapper>
        ) : (
          <StyledButton onClick={onConnectSnap}>Install zeTrax</StyledButton>
        )}
      </div>
    </HeaderWrapper>
  );
};

export default Header;
