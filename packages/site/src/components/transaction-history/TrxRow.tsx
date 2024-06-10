import { trimHexAddress } from '../../utils/trimHexAddr';
import styled from 'styled-components/macro';
import Arrow from '../utils/Arrow';
import { trackCctx } from '../../utils';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemState,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import CctxItem from './CctxItem';
import { useEffect, useState } from 'react';
import Typography from '../utils/Typography';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';
import { ReactComponent as RedirectIcon } from '../../assets/redirect.svg';

const TrxRowWrapper = styled(FlexRowWrapper)`
  width: fit-content;
  align-items: center;
  column-gap: 12px;

  .info-column {
    row-gap: 4px;
  }
  .redirect-icon {
    width: 16px;
    height: 16px;
  }
  .amount-status-wrapper {
    align-content: flex-end;
    justify-content: flex-end;
  }
  .status-pill {
    background: rgba(13, 73, 15, 0.6);
    border-radius: 12px;
    padding: 4px 8px;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 1);
  }
`;

interface TrxRowProps {
  trx: any;
  isSent: boolean;
  amount: number;
}

const TrxRow = ({ trx, isSent, amount }: TrxRowProps): JSX.Element => {
  const [cctx, setCctx] = useState<any>({});
  const [trxHash, setTrxHash] = useState('');
  useEffect(() => {
    const fetchCctx = async () => {
      if (trxHash) {
        console.log(trxHash);
        let cctxData: any = await trackCctx(trxHash);
        console.log(cctxData);
        if (cctxData?.code !== 5) {
          setCctx(cctxData.CrossChainTxs?.[0]);
        }
      }
    };
    fetchCctx();
    return () => {};
  }, [trxHash]);

  return (
    <Accordion allowZeroExpanded={true}>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <TrxRowWrapper>
              <div>
                <Arrow isReceived={!isSent} />
              </div>
              <FlexColumnWrapper className="info-column">
                <Typography size={16} color={isSent ? '#ff4a3d' : '#008462'}>
                  {isSent ? 'Sent' : 'Received'}
                </Typography>
                <Typography size={14}>
                  BTC trx:{' '}
                  <a
                    className=""
                    href={`https://mempool.space/testnet/tx/${trx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {trimHexAddress(trx.hash)}
                    <RedirectIcon className="redirect-icon" />
                  </a>
                </Typography>
              </FlexColumnWrapper>
              <FlexColumnWrapper className="info-column amount-status-wrapper">
                {' '}
                <Typography size={16} color={!isSent ? '#008462' : '#ff4a3d'}>
                  {isSent ? '-' : '+'}
                  {(amount / 1e8).toFixed(5)} BTC{' '}
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
        <AccordionItemPanel>
          <AccordionItemState>
            {({ expanded }) => {
              if (expanded) {
                setTrxHash(trx?.hash);
                if (cctx?.index && cctx?.code !== 5) {
                  return <CctxItem cctx={cctx} />;
                } else if (!!cctx && trx.confirmations >= 6 && !isSent) {
                  return (
                    <Typography size={16} color={'#45afec'}>
                      Direct BTC transaction - RECEIVED
                    </Typography>
                  );
                } else if (trx.confirmations >= 6 && isSent) {
                  return <div>Loading...</div>;
                } else if (trx.confirmations < 6) {
                  return (
                    <Typography size={16} color={'yellow'}>
                      6+ confirmations required
                    </Typography>
                  );
                }
              } else {
              }
            }}
          </AccordionItemState>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default TrxRow;
