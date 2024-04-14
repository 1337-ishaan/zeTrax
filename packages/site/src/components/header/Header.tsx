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

  const { btcAddress, address } = useAccount(!!state.installedSnap);

  const [balance, setBalance] = useState<any>({});
  const [zetaBalance, setZetaBalance] = useState<any>({});

  // const onCreateBtcAddr = async () => {
  //   await createBtcWallet();
  // };
  const onConnectSnap = async () => {
    await connectSnap();
    await createBtcWallet();
  };

  useEffect(() => {
    if (state.installedSnap || btcAddress) {
      const getBalance = async () => {
        let results: any = await getBtcUtxo();
        setBalance(results);
      };

      getBalance();
    }
  }, [state.installedSnap || btcAddress]);

  useEffect(() => {
    if (state.installedSnap && address) {
      const getZetaBal = async () => {
        let result: any = await getZetaBalance(address as string);
        setZetaBalance(result.balances[0]);
      };
      getZetaBal();
    }
  }, [state.installedSnap, address]);

  return (
    <HeaderWrapper>
      <Logo className="logo" />
      <Typography color="#eee" size={16}>
        Current fees: 12 Zeta
      </Typography>
      <div className="connect-wallet-wrapper">
        {state.installedSnap || address ? (
          <>
            <div>
              <div className="addr-type">BTC: {balance?.balance / 1e8} BTC</div>
              <div className="address-text">
                {btcAddress ? (
                  <>
                    <Copyable>{btcAddress}</Copyable>
                  </>
                ) : (
                  'Derive BTC address'
                )}
              </div>
            </div>
            <div>
              <div className="addr-type">
                EVM: {/* <div className="balance-text"> */}
                {(zetaBalance?.amount / 1e18).toFixed(8)}{' '}
                {zetaBalance?.denom?.toUpperCase()}
                {/* </div> */}
              </div>
              <div className="address-text">
                {address ? <Copyable>{address}</Copyable> : 'Connect Snap'}
              </div>
            </div>
          </>
        ) : (
          <>
            <StyledButton onClick={onConnectSnap}>Install zeTrax</StyledButton>
          </>
        )}
      </div>
    </HeaderWrapper>
  );
};

export default Header;
