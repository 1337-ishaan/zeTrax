import React, { useContext, useState } from 'react';
import { getBtcUtxo, trackCctx } from '../../utils';
import styled from 'styled-components';
import Typography from '../utils/Typography';
import TrxRow from './TrxRow';
import { ReactComponent as RefreshIcon } from '../../assets/refresh.svg';
import Loader from '../utils/Loader';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import TooltipInfo from '../utils/TooltipInfo';
import { StoreContext } from '../../hooks/useStore';
import Arrow from '../utils/Arrow';
import StyledButton from '../utils/StyledButton';

const TrxHistoryWrapper = styled.div`
  a {
    color: white;
  }
  background: ${(props) => props.theme.colors.dark?.default};
  box-shadow: 0px 0px 21px 5px rgba(0, 0, 0, 1);
  color: #dadada;
  padding: 24px;
  /* max-height: 77vh; */
  height: 340px;
  width: 400px;

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
  .filter-trx-type {
    justify-content: flex-end;
    align-items: center;
    padding: 4px 0;
    column-gap: 8px;
  }
`;

interface TrxHistoryInterface {}

const TrxHistory = (_: TrxHistoryInterface) => {
  const { globalState, setGlobalState } = useContext(StoreContext);
  const [isRefetched, setIsRefetched] = useState(false);
  const [filter, setFilter] = useState('');

  React.useEffect(() => {
    console.log('BALANCE TRX PROCESSED -->', globalState?.isTrxProcessed);

    if (
      (!!globalState?.btcAddress &&
        !globalState?.btcTrxs &&
        !globalState?.utxo) ||
      isRefetched
    ) {
      const getBtcTrx = async () => {
        try {
          const results: any = await getBtcUtxo();
          setGlobalState({
            ...globalState,
            btcTrxs: results,
            utxo: results?.final_balance - results?.unconfirmed_balance,
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsRefetched(false);
        }
      };
      getBtcTrx();
    }
  }, [globalState?.btcAddress, globalState?.utxo, isRefetched]);

  console.log(filter, 'filter');
  const getAmount = (trx: any) => {
    return trx.outputs.filter(
      (t: any) => t.addresses?.[0] === globalState?.btcAddress,
    )[0]?.value;
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

        <FlexRowWrapper className="filter-trx-type">
          <Arrow
            onClick={() =>
              filter !== 'SENT' ? setFilter('SENT') : setFilter('')
            }
          />
          <Arrow
            isReceived={true}
            onClick={() =>
              filter !== 'RECEIVED' ? setFilter('RECEIVED') : setFilter('')
            }
          />
          <RefreshIcon
            className="refresh-icon"
            onClick={() => setIsRefetched(true)}
          />
        </FlexRowWrapper>
      </FlexRowWrapper>

      {isRefetched ? (
        <div>
          <Loader />
        </div>
      ) : (
        globalState?.btcTrxs &&
        globalState?.btcTrxs?.txs?.map((trx: any) => {
          let trxs = () => {
            if (filter === 'SENT') {
              return !!trx.inputs[0].addresses?.includes(
                globalState?.btcAddress,
              );
            } else if (filter === 'RECEIVED') {
              return !trx.inputs[0].addresses?.includes(
                globalState?.btcAddress,
              );
            } else {
              return true;
            }
          };
          return (
            <>
              {trxs() && (
                <TrxRow
                  trx={trx}
                  isSent={trx.inputs[0].addresses?.includes(
                    globalState?.btcAddress,
                  )}
                  amount={getAmount(trx)}
                />
              )}
            </>
          );
        })
      )}
    </TrxHistoryWrapper>
  );
};

export default TrxHistory;
