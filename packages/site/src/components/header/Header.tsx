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
  return (
    <HeaderWrapper>
      <Logo />
      <div className="connect-wallet-wrapper">
        <StyledButton onClick={async () => await createBtcWallet()}>
          {btcAddress ? btcAddress : 'Derive BTC address'}
        </StyledButton>
        <StyledButton onClick={async () => await connectSnap()}>
          {address ? address : 'Connect Snap'}
        </StyledButton>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
