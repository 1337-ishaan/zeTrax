import React, { useState } from 'react';
import { getBtcUtxo, trackCctx } from '../../utils';
import styled from 'styled-components';
import Typography from '../utils/Typography';
import TrxRow from './TrxRow';
import useAccount from '../../hooks/useAccount';
import { ReactComponent as RefreshIcon } from '../../assets/refresh.svg';

const TrxHistoryWrapper = styled.div`
  a {
    color: white;
  }
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 21px 5px rgba(0, 0, 0, 1);

  width: 100%;
  color: #dadada;
  padding: 32px;
  max-height: 55vh;
  overflow-y: auto;
  .accordion__button {
    background-color: transparent !important;
    color: white;
    display: flex;
    align-items: center;
  }
  .accordion {
    border: none;
  }
  .flex-row {
    display: flex;
    justify-content: space-between;
  }
  .refresh-icon {
    cursor: pointer;
  }
`;

interface TrxHistoryInterface {}

const TrxHistory = (_: TrxHistoryInterface) => {
  const [btcTrx, setBtcTrx] = useState<any>([]);
  const { btcAddress } = useAccount(true);
  const [isRefetched, setIsRefetched] = useState(false);

  React.useEffect(() => {
    const getBtcTrx = async () => {
      if (btcTrx.length === 0 || isRefetched) {
        try {
          const results: any = await getBtcUtxo();
          setBtcTrx(results);
        } catch (error) {
          console.error(error);
        } finally {
          setIsRefetched(false);
        }
      }
    };
    getBtcTrx();
    return () => {};
  }, [isRefetched]);

  const getAmount = (trx: any) => {
    return trx.outputs.filter((t: any) => t.addresses?.[0] === btcAddress)[0]
      .value;
  };

  return (
    <TrxHistoryWrapper>
      <div className="flex-row">
        <Typography>Transactions</Typography>
        <RefreshIcon
          className="refresh-icon"
          onClick={() => setIsRefetched(true)}
        />
      </div>

      {isRefetched ? (
        <div>Loader</div>
      ) : (
        btcTrx?.txs?.map((trx: any) => (
          <TrxRow
            trx={trx}
            isSent={trx.inputs[0].addresses?.includes(btcAddress)}
            amount={getAmount(trx)}
          />
        ))
      )}
    </TrxHistoryWrapper>
  );
};

export default TrxHistory;
