import styled from 'styled-components/macro';
import StyledButton from '../utils/StyledButton';
import { ReactComponent as Logo } from '../../assets/flask_fox.svg';
import { connectSnap, createBtcWallet } from '../../utils';
import useAccount from '../../hooks/useAccount';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 40px;
  .connect-wallet-wrapper {
    display: flex;
    column-gap: 8px;
  }
`;

interface HeaderProps {}

const Header = ({}: HeaderProps): JSX.Element => {
  const { btcAddress, address } = useAccount();
  console.log(btcAddress, address, 'btc');

  const onCreateBtcAddr = async () => {
    await createBtcWallet();
  };
  const onConnectSnap = async () => {
    await connectSnap();
  };
  return (
    <HeaderWrapper>
      <Logo />
      <div className="connect-wallet-wrapper">
        <StyledButton onClick={onCreateBtcAddr}>
          {btcAddress ? btcAddress : 'Derive BTC address'}
        </StyledButton>
        <StyledButton onClick={onConnectSnap}>
          {address ? address : 'Connect Snap'}
        </StyledButton>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
