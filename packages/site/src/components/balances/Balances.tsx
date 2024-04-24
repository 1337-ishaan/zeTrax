import styled from 'styled-components/macro';
import { useContext, useEffect, useState } from 'react';
import { MetaMaskContext } from '../../hooks';
import useAccount from '../../hooks/useAccount';
import { getBtcUtxo, getZetaBalance } from '../../utils';
import Copyable from '../utils/Copyable';
import Typography from '../utils/Typography';

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
      <Typography>Balances</Typography>
      <br />
      <div>
        <div>
          <Typography className="addr-type">
            BTC: {balance?.balance / 1e8} BTC
          </Typography>
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
        <br />
        <div>
          <Typography className="addr-type">
            <>
              EVM: {/* <Typography className="balance-text"> */}
              {(zetaBalance?.amount / 1e18).toFixed(8)}{' '}
              {zetaBalance?.denom?.toUpperCase()}
            </>
          </Typography>
        </div>
        <div className="address-text">
          {address ? <Copyable>{address}</Copyable> : 'Connect Snap'}
        </div>
      </div>
    </BalancesWrapper>
  );
};

export default Balances;