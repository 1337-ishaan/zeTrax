import React, { useState } from 'react';
import { getBtcUtxo, trackCctx } from '../../utils';
import styled from 'styled-components';
import Typography from '../utils/Typography';
import TrxRow from './TrxRow';
import useAccount from '../../hooks/useAccount';

const TrxHistoryWrapper = styled.div`
  a {
    color: white;
  }
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  width: 40%;
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
`;

interface TrxHistoryInterface {}

const TrxHistory = (_: TrxHistoryInterface) => {
  const [btcTrx, setBtcTrx] = useState<any>([]);
  const { btcAddress } = useAccount();

  React.useEffect(() => {
    const getBtcTrx = async () => {
      if (btcTrx.length === 0) {
        try {
          const results: any = await getBtcUtxo();
          setBtcTrx(results);
          console.log(JSON.parse(results));
        } catch (error) {
          console.error(error);
        }
      }
    };
    getBtcTrx();
    return () => {};
  }, [btcTrx.length === 0]);
  console.log(btcTrx, 'btctrx');
  // React.useEffect(() => {
  //   if (cctx.length === 0 && btcTrx.length > 0) {
  //     const fetchCctx = async () => {
  //       try {
  //         const results: any = await trackCctx(btcTrx?.txs?.[0]?.hash);
  //         console.log(results, 'results');
  //         setCctx(results);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  //     fetchCctx();
  //     return () => {};
  //   }
  // }, []);

  return (
    <TrxHistoryWrapper>
      <Typography>Transactions</Typography>
      {btcTrx?.txs?.map((trx: any) => (
        <TrxRow
          trx={trx}
          isSent={
            trx.inputs[0].addresses.includes(btcAddress)
            // ? true
            // : false
          }
        />
      ))}
    </TrxHistoryWrapper>
  );
};

export default TrxHistory;
