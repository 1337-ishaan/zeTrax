import React, { useContext, useState, useEffect } from 'react';
import { getBtcUtxo } from '../../utils';
import styled from 'styled-components';
import Typography from '../utils/Typography';
import TrxRow from './TrxRow';
import { ReactComponent as RefreshIcon } from '../../assets/refresh.svg';
import Loader from '../utils/Loader';
import FlexRowWrapper from '../utils/wrappers/FlexRowWrapper';
import TooltipInfo from '../utils/TooltipInfo';
import { StoreContext } from '../../hooks/useStore';
import Arrow from '../utils/Arrow';

const TrxHistoryWrapper = styled.div`
  background: ${(props) => props.theme.colors.dark?.default};
  box-shadow: 0px 0px 21px 5px rgba(0, 0, 0, 1);
  color: #dadada;
  padding: 24px;
  height: 340px;
  overflow-x: none;
  overflow-y: auto;
  border-radius: ${(props) => props.theme.borderRadius};

  a {
    color: white;
  }

  .accordion__button {
    background-color: transparent !important;
    color: white;
    display: flex;
    width: fit-content;
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

    .t-filter {
      cursor: pointer;

      &.active {
        background: #d5d5d5;
      }
    }
  }
`;

const TrxHistory: React.FC = () => {
  const { globalState, setGlobalState } = useContext(StoreContext);
  const [isRefetched, setIsRefetched] = useState(false);
  const [filter, setFilter] = useState<'SENT' | 'RECEIVED' | ''>('');

  useEffect(() => {
    if (
      (!!globalState?.btcAddress &&
        !globalState?.btcTrxs &&
        !globalState?.utxo) ||
      isRefetched ||
      globalState.isTrxProcessed
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
  }, [
    globalState?.btcAddress,
    globalState?.utxo,
    isRefetched,
    globalState?.isTrxProcessed,
    setGlobalState,
  ]);

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
          <TooltipInfo>
            <Typography size={14} weight={500}>
              Track your BTC transactions here ↓
            </Typography>
          </TooltipInfo>
        </Typography>

        <FlexRowWrapper className="filter-trx-type">
          <Arrow
            className={`t-filter ${filter === 'SENT' && 'active'}`}
            onClick={() =>
              filter !== 'SENT' ? setFilter('SENT') : setFilter('')
            }
          />
          <Arrow
            className={`t-filter ${filter === 'RECEIVED' && 'active'}`}
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
        <Loader />
      ) : (
        globalState?.btcTrxs?.txs?.map((trx: any, index: number) => {
          const isSent = trx.inputs[0].addresses?.includes(
            globalState?.btcAddress,
          );
          const shouldRender =
            filter === '' ? true : filter === 'SENT' ? isSent : !isSent;

          return (
            shouldRender && (
              <TrxRow
                key={index}
                trx={trx}
                isSent={isSent}
                amount={getAmount(trx)}
              />
            )
          );
        })
      )}
    </TrxHistoryWrapper>
  );
};

export default TrxHistory;
