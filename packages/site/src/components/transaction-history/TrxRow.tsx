import { trimHexAddress } from '../../utils/trimHexAddr';
import styled from 'styled-components/macro';
import Arrow from '../utils/Arrow';
import { trackCctx } from '../../utils';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion';
import CctxItem from './CctxItem';
import { useEffect, useState } from 'react';
import Typography from '../utils/Typography';
import FlexRowWrapper from '../utils/wrappers/FlexRowWrapper';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';
import { ReactComponent as RedirectIcon } from '../../assets/redirect.svg';

const TrxRowWrapper = styled(FlexRowWrapper)`
  align-items: center;
  column-gap: 48px;
  justify-content: space-between;
  .redirect-icon {
    width: 16px;
    height: 16px;
  }
.info-column{
    row-gap: 4px;
}
  .amount-status-wrapper {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    // width: 100%;
  }

  .status-pill {
    background: rgba(13, 73, 15, 0.6);
    border-radius: 12px;
    white-space:nowrap;
    padding: 4px 8px;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 1);
  }

  .trx-hash{
      white-space: nowrap;
    }
  } 
  .t-trx-amount{
    white-space:nowrap;
  }
`;

interface Trx {
  hash: string;
  confirmations: number;
}

interface TrxRowProps {
  trx: Trx;
  isSent: boolean;
  amount: number;
}

const TrxRow: React.FC<TrxRowProps> = ({ trx, isSent, amount }) => {
  const [cctx, setCctx] = useState<any>({});
  const [trxHash, setTrxHash] = useState('');

  useEffect(() => {
    const fetchCctx = async () => {
      if (trxHash) {
        const cctxData: any = await trackCctx(trxHash);
        if (cctxData?.code !== 5) {
          setCctx(cctxData!.CrossChainTx);
        }
      }
    };
    fetchCctx();
  }, [trxHash]);

  console.log(cctx, 'cctx trx row');

  const renderContent = () => {
    if (cctx?.index ) {
      return <CctxItem cctx={cctx} />;
    } else if (!!cctx && trx.confirmations >= 6 && !isSent) {
      return (
        <Typography size={16} color={'#45afec'}>
          Direct BTC transaction - RECEIVED
        </Typography>
      );
    } else if (!cctx.index && trx.confirmations >= 6 && isSent) {
      return <Typography size={16}>Loading...</Typography>;
    } else if (trx.confirmations < 6) {
      return (
        <Typography size={16} color={'yellow'}>
          6+ confirmations required
        </Typography>
      );
    }
  };

  return (
    <Accordion allowZeroExpanded>
      <AccordionItem>
        <AccordionItemHeading >
          <AccordionItemButton style={{ width: 'auto' }}>
            <TrxRowWrapper>
              <FlexRowWrapper className="trx-hash-wrapper">
                <Arrow isReceived={!isSent} />
                <FlexColumnWrapper className="info-column type-hash-wrapper">
                  <Typography size={16} color={isSent ? '#ff4a3d' : '#008462'}>
                    {isSent ? 'Sent' : 'Received'}
                  </Typography>
                  <Typography size={14} className="trx-hash">
                    BTC trx:
                    <a
                      href={`https://mempool.space/testnet/tx/${trx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {trimHexAddress(trx.hash)}
                      <RedirectIcon className="redirect-icon" />
                    </a>
                  </Typography>
                </FlexColumnWrapper>
              </FlexRowWrapper>

              <FlexColumnWrapper className="info-column amount-status-wrapper">
                <Typography
                  className="t-trx-amount"
                  size={14}
                  color={!isSent ? '#008462' : '#ff4a3d'}
                >
                  {isSent ? '-' : '+'}
                  {isNaN(amount / 1e8)
                    ? '0'
                    : parseFloat((amount / 1e8).toFixed(8)).toString()}
                  BTC{' '}
                </Typography>
                <Typography
                  size={12}
                  className="status-pill"
                  color={trx.confirmations > 6 ? '#ffffff' : 'yellow'}
                >
                  {trx.confirmations > 6
                    ? 'Confirmed'
                    : `${trx.confirmations} confirmations`}
                </Typography>
              </FlexColumnWrapper>
            </TrxRowWrapper>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel style={{ width: 'min-content' }}>
          <AccordionItemState>
            {({ expanded }) => {
              if (expanded) setTrxHash(trx.hash);
              if(!!cctx.index){
                return <CctxItem cctx={cctx} />
              }else{
                renderContent();
              }
              
              return null;
            }}
          </AccordionItemState>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default TrxRow;
