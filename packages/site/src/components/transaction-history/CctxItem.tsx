import React from 'react';
import styled from 'styled-components/macro';
import { trimHexAddress } from '../../utils/trimHexAddr';
import { getChainIcon } from '../../constants/getChainIcon';
import Typography from '../utils/Typography';
import { ReactComponent as RightArrow } from '../../assets/right-arrow.svg';
import { ReactComponent as RedirectIcon } from '../../assets/redirect.svg';
import FlexRowWrapper from '../utils/wrappers/FlexRowWrapper';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';
import InfoBox from '../utils/InfoBox';

// Styled component for the CctxItem
const CctxItemWrapper = styled(FlexColumnWrapper)`
  background: rgba(0, 0, 0, 0.3);
  row-gap: 8px;
  padding: 24px ;
  border-radius: 12px;
  width: 20em;
  a {
    color: #eee;
    font-size: 16px;
  }

  .flex-row {
    row-gap: 12px;
  }

  .chain-swap {
    margin: 16px 0;
    column-gap: 16px;
    justify-content: start;

    .chain-logo {
      height: 48px;
    }
  }

  .arrow-icon {
    width: 48px;
  }

  .redirect-icon {
    width: 16px;
    height: 16px;
  }
`;

// Define the structure of the CctxItemProps interface
interface InboundTxParams {
  sender_chain_id: number;
  amount: number;
  tx_finalization_status: string;
}

interface OutboundTxParams {
  receiver_chainId: number;
  receiver: string;
}

interface Cctx {
  index: string;
  inbound_params: InboundTxParams;
  outbound_params: OutboundTxParams[];
}

interface CctxItemProps {
  cctx: Cctx;
}

// CctxItem component definition
const CctxItem: React.FC<CctxItemProps> = ({ cctx }) => {
  // Error handling: Check if cctx is valid
  if (!cctx || !cctx.inbound_params || !cctx.outbound_params.length) {
    return <Typography color="#ff0000">Invalid transaction data.</Typography>;
  }

  const { inbound_params, outbound_params } = cctx;

  return (
    <CctxItemWrapper>
      <Typography color="#a9a8a8" size={18}>
        ZetaChain CCTX Transaction
      </Typography>
      <FlexRowWrapper className="chain-swap">
        <img
          className="chain-logo"
          // @ts-ignore
          src={getChainIcon(+inbound_params.sender_chain_id)}
          alt=""
        />
        <RightArrow className="arrow-icon" />
        <img
          className="chain-logo"
          // @ts-ignore
          src={getChainIcon(+outbound_params?.[0].receiver_chainId)}
          alt=""
        />
      </FlexRowWrapper>
      <FlexRowWrapper className="flex-row">
        <Typography size={16}>
          Trx Hash:{' '}
          <a
            href={`https://athens.explorer.zetachain.com/cc/tx/${cctx.index}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {trimHexAddress(cctx.index)}
            <RedirectIcon className="redirect-icon" />
          </a>
        </Typography>
      </FlexRowWrapper>
      <Typography size={14}>
        Amount after fees:&nbsp;
        {parseFloat((inbound_params.amount / 1e8).toFixed(8))} tBTC
      </Typography>
      <FlexRowWrapper className="flex-row">
        <Typography size={14} color="#bed837">
          CCTX Status: {inbound_params.tx_finalization_status}
        </Typography>
      </FlexRowWrapper>
      <InfoBox>
        All transactions are processed through ZetaChain. To view more details,
        visit ZetaScan (Trx Hash).
      </InfoBox>
    </CctxItemWrapper>
  );
};

export default CctxItem;
