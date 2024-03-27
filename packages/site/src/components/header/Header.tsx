import styled from 'styled-components/macro';
import StyledButton from '../utils/StyledButton';
import { ReactComponent as Logo } from '../../assets/zetachain.svg';
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

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 40px;
  .connect-wallet-wrapper {
    display: flex;
    /* flex-direction: column; */
    row-gap: 12px;
    column-gap: 8px;
    color: #fff;
  }
  .address-text {
    font-size: 16px;
    /* font-family: 'Sans'; */
  }
  .addr-type {
    font-size: 20px;
  }
  .balance-text {
    font-size: 16px;
    padding: 12px 12px 12px 0;
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
  };

  useEffect(() => {
    if (state.installedSnap || address) {
      const getBalance = async () => {
        let results: any = await getBtcUtxo();
        setBalance(results);
      };

      getBalance();
    }
  }, [state.installedSnap, address]);

  useEffect(() => {
    if (state.installedSnap || address) {
      const getZetaBalance = async () => {
        // await getWalletInfo();
        let zetaAddr = 'zeta1wzv3cgx8cnsqy8hsh5mgtpmvcwk9y50seg8g8t';
        let result = await axios.get(
          `https://zetachain-athens.blockpi.network/lcd/v1/public/cosmos/bank/v1beta1/spendable_balances/${zetaAddr}`,
        );
        setZetaBalance(result.data.balances[0]);
      };
      getZetaBalance();
    }

    // if (address) {
    //   const getBalance = async () => {
    //     let results: any = await getZetaBalance(address as string);
    //     setZetaBalance(results);
    //   };
    //   getBalance();
    // }
  }, [state.installedSnap || address]);

  return (
    <HeaderWrapper>
      <Logo />
      <div className="connect-wallet-wrapper">
        {state.installedSnap || address ? (
          <>
            <div>
              <div className="addr-type">BTC</div>
              <div className="address-text">
                {btcAddress ? (
                  <>
                    <Copyable>{btcAddress}</Copyable>
                    <div className="balance-text">
                      Balance: {balance?.balance / 1e8} BTC
                    </div>
                  </>
                ) : (
                  'Derive BTC address'
                )}
              </div>
            </div>
            <div>
              <div className="addr-type">EVM</div>
              <div className="address-text">
                {address ? <Copyable>{address}</Copyable> : 'Connect Snap'}
              </div>
              <div className="balance-text">
                Zeta: {(zetaBalance?.amount / 1e18).toFixed(8)}
                {zetaBalance?.denom}
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
