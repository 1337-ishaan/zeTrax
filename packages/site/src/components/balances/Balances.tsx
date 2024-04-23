import styled from 'styled-components/macro';
import { useContext, useEffect, useState } from 'react';
import { MetaMaskContext } from '../../hooks';
import useAccount from '../../hooks/useAccount';
import { getBtcUtxo, getZetaBalance } from '../../utils';
import Copyable from '../utils/Copyable';

const BalancesWrapper = styled.div``;

interface BalancesProps {}

const Balances = ({}: BalancesProps): JSX.Element => {
  const [state] = useContext(MetaMaskContext);
  const { btcAddress, address } = useAccount(!!state.installedSnap);
  const [balance, setBalance] = useState<any>({});
  const [zetaBalance, setZetaBalance] = useState<any>({});

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
    <BalancesWrapper>
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
    </BalancesWrapper>
  );
};

export default Balances;
