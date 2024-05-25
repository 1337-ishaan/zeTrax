import { useContext } from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { MetaMaskContext } from '../../hooks';
import useAccount from '../../hooks/useAccount';
import { connectSnap, createBtcWallet, disconnectSnap } from '../../utils';
import StyledButton from '../utils/StyledButton';

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

  const onConnectSnap = async () => {
    await connectSnap();
    await createBtcWallet();
  };

  const onDisconnectSnap = async () => {
    await disconnectSnap();
  };

  return (
    <HeaderWrapper>
      <Logo className="logo" />
      <div className="connect-wallet-wrapper">
        {state.installedSnap || address ? (
          <StyledButton onClick={onDisconnectSnap}>Disconnect</StyledButton> // TODO: Add disconnection logic
        ) : (
          <StyledButton onClick={onConnectSnap}>Install zeTrax</StyledButton>
        )}
      </div>
    </HeaderWrapper>
  );
};

export default Header;
