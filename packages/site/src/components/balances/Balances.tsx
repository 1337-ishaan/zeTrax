import styled from 'styled-components/macro';
import { useContext, useEffect, useState } from 'react';
import { MetaMaskContext } from '../../hooks';
import useAccount from '../../hooks/useAccount';
import { getBtcUtxo, getZetaBalance } from '../../utils';
import Copyable from '../utils/Copyable';
import Typography from '../utils/Typography';
import BalancePie from './charts/BalancePie';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';
import { ReactComponent as RightArrow } from '../../assets/right-arrow.svg';
import { ReactComponent as BtcIcon } from '../../assets/bitcoin.svg';
import { ReactComponent as ZetaIcon } from '../../assets/zetachain.svg';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';

import TooltipInfo from '../utils/TooltipInfo';
import { trimHexAddress } from '../../utils/trimHexAddr';

const BalancesWrapper = styled(FlexColumnWrapper)`
  padding: 32px;
  background: ${(props) => props.theme.colors.dark?.default};
  box-shadow: 0px 0px 21px 5px rgba(0, 0, 0, 1);
  height: fit-content;
  border-radius: ${(props) => props.theme.borderRadius};

  .balance-wrapper {
    align-items: center;
    padding: 0 0 0 6px;
    column-gap: 16px;
    .right-arrow {
      width: 24px;
      color: #fff;
    }
  }

  .balances-list-card {
    justify-items: flex-end;
    padding: 16px 24px;
    max-height: 80%;
    overflow-y: auto;
    border: 1px solid #eeeeee3b;
    border-radius: 20px;
  }

  .t-wallet-type {
    border-bottom: 0.1px solid #ffffff;
    padding: 0px 0 4px 0;
    color: #ecececac;
  }

  .chart-list-wrapper {
    justify-content: space-between;
    margin-top: 24px;
    align-items: center;
  }

  .input-container {
    position: relative;
    display: inline-block;

    .searched-input {
      outline: none;
      padding: 12px;
      border-radius: 12px;
      border: none;
      background: rgba(12, 12, 12, 0.8);
      color: #fff;
      width: 40%;
      font-size: 16px;
      margin-top: 24px;
      position: relative;
      display: inline-block;
      padding-left: 30px;
    }
  }

  .usd-value {
    color: #555555;
  }

  table {
    width: 100%;
    border: 1px solid #ddd;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 4px 8px;
    color: #eee;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    color: #a5a8a5;
    text-transform: uppercase;
  }
`;

interface BalancesProps {}

const Balances = ({}: BalancesProps): JSX.Element => {
  const [state] = useContext(MetaMaskContext);
  console.log(state, 'state');
  const { btcAddress, address } = useAccount(!!state.installedSnap, 'balance');
  const [balance, setBalance] = useState<any>({});
  const [zetaBalance, setZetaBalance] = useState<any>({});
  const [data, setData] = useState<any>();
  const [searched, setSearched] = useState<any>('');

  useEffect(() => {
    if (state.snapsDetected && btcAddress) {
      const getBalance = async () => {
        let results: any = await getBtcUtxo();
        setBalance(results);
      };

      getBalance();
    }
  }, [btcAddress]);

  useEffect(() => {
    if (state.snapsDetected && address) {
      const getZetaBal = async () => {
        let result: any = await getZetaBalance(address as string);
        console.log(result, 'result');
        setZetaBalance(result);

        let maps = result?.nonZeta?.map((t: any) => {
          return {
            label: t?.token?.symbol,
            value: t?.value / (t?.token?.symbol === 'tBTC' ? 1e6 : 1e12),
          };
        });
        // TODO: Decimals to fix
        if (balance) {
          setData([
            {
              label: 'BTC',
              value: balance?.balance / 1e8,
            },
            ...maps,
            {
              label: result?.zeta?.balances[0]?.denom,
              value: result?.zeta?.balances[0]?.amount / 1e15,
            },
          ]);
        }
      };
      getZetaBal();
    }
  }, [state.snapsDetected, address, balance]);
  console.log(balance, 'balance');

  const onSearched = (searchText: string) => {
    if (data && !!searchText) {
      let searchedData = data.filter((t: any) =>
        t?.label.toLowerCase().includes(searchText.toLowerCase()),
      );
      setSearched(searchedData);
    } else {
      setSearched(data);
    }
  };

  return (
    <BalancesWrapper>
      <Typography size={24}>
        Balances
        <TooltipInfo
          children={
            <Typography size={14} weight={500}>
              All assets on the ZetaChain Network and <br />
              Bitcoin Network (BTC) is displayed here ↓
            </Typography>
          }
        />
      </Typography>
      <div className="input-container">
        <input
          placeholder="Search Asset"
          onChange={(e) => onSearched(e.target.value)}
          className="searched-input"
        />
      </div>

      <FlexRowWrapper className="chart-list-wrapper">
        <BalancePie data={searched.length > 0 ? searched : data} />
      </FlexRowWrapper>
      <div>
        {/* className={`${index === 0 || 1 ? 't-wallet-type' : ''}`} */}
        {/* <FlexColumnWrapper className="balances-list-card"> */}
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Amount</th>
              <th>Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {(searched.length > 0 ? searched : data)?.map(
              (t: any, index: number) => (
                <tr>
                  {/* {index === 0 ? (
                      <Typography size={18} className="t-wallet-type">
                        <BtcIcon className="chain-icon" />
                        <Copyable>{trimHexAddress(btcAddress!)}</Copyable>
                      </Typography>
                    ) : (
                      index === 1 && (
                        <Typography size={18} className="t-wallet-type">
                          <ZetaIcon className="chain-icon" />
                          <Copyable>{trimHexAddress(address!)}</Copyable>
                        </Typography>
                      )
                    )} */}

                  {/* <FlexRowWrapper className="balance-wrapper"> */}
                  <td>
                    <Typography size={14}>
                      {t.label === 'BTC' ? (
                        <BtcIcon className="chain-icon" />
                      ) : (
                        <ZetaIcon className="chain-icon" />
                      )}
                      {t.label}
                    </Typography>{' '}
                    {/* <RightArrow className="right-arrow" /> */}
                  </td>
                  <td>
                    <Typography size={14}>
                      {t.value.toFixed(5)} {t.label}
                      {/* TODO: USE `exchangeRate` from zeta.tokens to calculate & fetch BTC balance or use tBTC price for BTC to USD conversion*/}
                    </Typography>
                  </td>
                  <td>$0</td>

                  {/* </FlexRowWrapper> */}
                </tr>
              ),
            )}
          </tbody>
        </table>
        {/* </FlexColumnWrapper> */}
      </div>
    </BalancesWrapper>
  );
};

export default Balances;
