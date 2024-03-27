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

const TrxRowWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  width: fit-content;
  .info-column {
    display: flex;
    font-size: 16px;
    flex-direction: column;
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
              {/* <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://mempool.space/testnet/tx/${trx.hash}`}
                > */}
              <div>
                <Arrow isReceived={!isSent} />
              </div>
              <div className="info-column">
                <div>{isSent ? 'Sent' : 'Received'}</div>
                <div>
                  BTC hash:{' '}
                  <a
                    className=""
                    href={`https://mempool.space/testnet/tx/${trx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {trimHexAddress(trx.hash)}
                  </a>
                  {/* From:{' '}
                  {trimHexAddress('0x70991c20c7C4e0021Ef0Bd3685876cC3aC5251F0')} */}
                </div>
              </div>
              <div className="info-column">
                {' '}
                <div>{(amount / 1e8).toFixed(5)} BTC</div>
                <div>Confirmations: {trx.confirmations}</div>
              </div>
              {/* </a> */}
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
