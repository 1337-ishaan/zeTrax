import React, { useState } from 'react';
import { getBtcUtxo } from '../../utils';
import styled from 'styled-components';
import Typography from '../utils/Typography';
import TrxRow from './TrxRow';
import useAccount from '../../hooks/useAccount';

const TrxHistoryWrapper = styled.div`
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  width: fit-content;
  color: #dadada;
  padding: 20px 40px;
  max-height: 70vh;
  overflow-y: auto;
`;

interface TrxHistoryInterface {}

const TrxHistory = (_: TrxHistoryInterface) => {
  // const { btcAddress } = useAccount();
  const [btcTrx, setBtcTrx] = useState<any>([]);
  React.useEffect(() => {
    if (btcTrx.length === 0) {
      const getBtcTrx = async () => {
        try {
          const results: any = await getBtcUtxo();
          setBtcTrx(results);
          console.log(JSON.parse(results));
        } catch (error) {
          console.error(error);
        }
      };

      getBtcTrx();
      return () => {};
    }
  }, []);

  console.log(btcTrx, 'btctrx');
  return (
    <TrxHistoryWrapper>
      <Typography>Transactions</Typography>
      {btcTrx?.txs?.map((trx: any) => (
        <TrxRow trx={trx} />
      ))}
    </TrxHistoryWrapper>
  );
};

export default TrxHistory;
