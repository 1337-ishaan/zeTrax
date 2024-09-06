import styled from 'styled-components/macro';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../hooks/useStore';
import { getZetaBalance } from '../../utils';
import DOMPurify from 'dompurify';
import { ReactComponent as BtcIcon } from '../../assets/bitcoin.svg';
import { ReactComponent as ZetaIcon } from '../../assets/zetachain.svg';
import Typography from '../utils/Typography';
import TooltipInfo from '../utils/TooltipInfo';
import FlexRowWrapper from '../utils/wrappers/FlexRowWrapper';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';
import BalancePie from './charts/BalancePie';
import BigNumber from 'bignumber.js';
import EmptyBalance from './EmptyBalance';
interface BalanceData {
  label: string;
  value: number;
}

interface NonZetaToken {
  token: {
    symbol: string;
  };
  value: number;
}

interface ZetaBalance {
  denom: string;
  amount: number;
}

interface ZetaBalanceResponse {
  nonZeta: NonZetaToken[];
  zeta: {
    balances: ZetaBalance[];
  };
}

const BalancesWrapper = styled(FlexColumnWrapper)`
  padding: 32px;
  background: ${(props) => props.theme.colors.dark?.default};
  box-shadow: 0px 0px 21px 5px rgba(0, 0, 0, 1);
  border-radius: ${(props) => props.theme.borderRadius};
  width: 50%;
  width: 500px;

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
    }
  }

  table {

    border: 3px solid #ddd;
    border-collapse: collapse;

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
  }

  .error-message {
    color: #eee;
    margin-top: 16px;
  }
  .balance-pie-container{
    width:100%;
    height:100%;
    justify-content: space-around;

  }

`;

interface BalancesProps {}

const Balances = ({}: BalancesProps): JSX.Element => {
  const { globalState } = useContext(StoreContext);
  const [data, setData] = useState<BalanceData[]>([]);
  const [searched, setSearched] = useState<BalanceData[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (globalState?.evmAddress &&  typeof globalState?.utxo === 'number') {
      const fetchBalances = async () => {
        try {
          const result = (await getZetaBalance(
            globalState.evmAddress as string,
          )) as ZetaBalanceResponse;

          const maps: BalanceData[] = result?.nonZeta?.map((t) => ({
            label: t.token.symbol,
            value: new BigNumber(t?.value)
              .dividedBy(t?.token?.symbol === 'tBTC' ? 1e8 : 1e18)
              .toNumber(),
          }));

          if (result.zeta.balances.length === 0 && result.nonZeta.length === 0) {
            setData([
              {
                label: 'BTC',
                value: 0,
              },
              {
                label: 'ZETA',
                value: 0,
              },
            ]);
          } else {
          setData([
            {
              label: 'BTC',
              value: globalState.utxo / 1e8,
            },
            ...maps,
            {
              label: result.zeta.balances[0]?.denom!,
              value: result.zeta.balances[0]?.amount! / 1e18 ,
            },
          ]);
        }
          setError(null);
        } catch (err) {
          setError('Failed to fetch balance data. Please try again later.');
          console.error(err);
        }
      };
      fetchBalances();
    }
  }, [globalState?.evmAddress, globalState?.utxo]);

  const handleSearch = (text: string) => {
    const searchText = DOMPurify.sanitize(text);
    if (data.length > 0 && searchText) {
      const filteredData = data.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase()),
      );
      setSearched(filteredData);
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
              Bitcoin Network (BTC) are displayed here ↓
            </Typography>
          }
        />
      </Typography>
      
      <div className="input-container">
        <input
          placeholder="Search Asset"
          onChange={(e) => handleSearch(e.target.value)}
          className="searched-input"
        />
      </div>

      {error && <div className="error-message">"Error loading balances, kindly re-install ZetaMask</div>}


      <FlexColumnWrapper className='balance-pie-container'>

      {data.length >= 2 && data[0]!.value + data[1]!.value > 0 ? (
        <BalancePie data={data} />
      ) : (
        <EmptyBalance />
      )}

      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Amount</th>
            <th>Amount ($)</th>
          </tr>
        </thead>
        <tbody>

          {(searched.length > 0 ? searched : data).map((item, index) => (
            <tr key={index}>
              <td>
                <Typography size={14}>
                  {item.label === 'BTC' ? (
                    <BtcIcon className="chain-icon" />
                  ) : (
                    <ZetaIcon className="chain-icon" />
                  )}
                  {item.label}
                </Typography>
              </td>
              <td>
                <Typography size={14}>
                  {parseFloat(item.value.toString()).toLocaleString(undefined, {minimumSignificantDigits: 1, maximumSignificantDigits: 8})} {item.label}
                </Typography>
              </td>
              <td>$0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FlexColumnWrapper>
    </BalancesWrapper>
  );
};

export default Balances;
