import React, { useState } from 'react';
import { getBtcUtxo, trackCctx } from '../../utils';
import styled from 'styled-components';
import Typography from '../utils/Typography';
import TrxRow from './TrxRow';
import useAccount from '../../hooks/useAccount';
import { ReactComponent as RefreshIcon } from '../../assets/refresh.svg';
import Loader from '../utils/Loader';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import TooltipInfo from '../utils/TooltipInfo';

const TrxHistoryWrapper = styled.div`
  a {
    color: white;
  }
  background: ${(props) => props.theme.colors.dark?.default};
  box-shadow: 0px 0px 21px 5px rgba(0, 0, 0, 1);
  color: #dadada;
  padding: 24px;
  max-height: 72vh;

  overflow-y: auto;
  border-radius: ${(props) => props.theme.borderRadius};

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
      <FlexRowWrapper className="flex-row">
        <Typography>
          Transactions
          <TooltipInfo
            children={
              <Typography size={14} weight={500}>
                Track your BTC transactions here ↓
              </Typography>
            }
          />
        </Typography>
        <RefreshIcon
          className="refresh-icon"
          onClick={() => setIsRefetched(true)}
        />
      </FlexRowWrapper>

      {isRefetched ? (
        <div>
          <Loader />
        </div>
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
