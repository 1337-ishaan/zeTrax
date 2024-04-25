import { trimHexAddress } from '../../utils/trimHexAddr';
import styled from 'styled-components/macro';
import Arrow from '../utils/Arrow';
import * as zeta from '@zetachain/toolkit/dist/helpers';
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
  align-items: center;
  column-gap: 12px;
  width: fit-content;
  .info-column {
    row-gap: 4px;
  }
  .redirect-icon {
    width: 16px;
    height: 16px;
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
        console.log(cctx, 'cc');
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
                <Typography size={16}>
                  BTC trx hash:{' '}
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
              <FlexColumnWrapper className="info-column">
                {' '}
                <Typography size={16} color={!isSent ? '#008462' : '#ff4a3d'}>
                  {isSent ? '-' : '+'}
                  {(amount / 1e8).toFixed(5)} BTC{' '}
                </Typography>
                <Typography
                  size={16}
                  color={trx.confirmations > 6 ? '#008462' : 'yellow'}
                >
                  {trx.confirmations > 6
                    ? 'Confirmed'
                    : trx.confirmations + ' confirmations'}
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
