import React from 'react';
import styled from 'styled-components/macro';
import { trimHexAddress } from '../../utils/trimHexAddr';
import { getChainIcon } from '../../constants/getChainIcon';
import Typography from '../utils/Typography';
import { ReactComponent as RightArrow } from '../../assets/right-arrow.svg';
import { ReactComponent as RedirectIcon } from '../../assets/redirect.svg';

import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';

const CctxItemWrapper = styled(FlexColumnWrapper)`
  background: rgba(0, 0, 0, 0.5);
  row-gap: 8px;
  padding: 20px;
  border-radius: 12px;
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

interface CctxItemProps {
  cctx: any;
}

const CctxItem = ({ cctx }: CctxItemProps): JSX.Element => {
  console.log(cctx, 'cctx');
  return (
    <CctxItemWrapper>
      <Typography color="#a9a8a8" size={18}>
        ZetaChain CCTX transaction
      </Typography>
      <FlexRowWrapper className="chain-swap">
        <img
          className="chain-logo"
          // @ts-ignore
          src={getChainIcon(+cctx.inbound_tx_params.sender_chain_id)}
          alt=""
        />
        <RightArrow className="arrow-icon" />
        <img
          className="chain-logo"
          // @ts-ignore
          src={getChainIcon(+cctx.outbound_tx_params?.[0].receiver_chainId)}
          alt=""
        />
      </FlexRowWrapper>
      <FlexRowWrapper className="flex-row ">
        <Typography size={16}>
          Trx Hash:{' '}
          <a
            href={`https://athens.explorer.zetachain.com/cc/tx/${cctx.index}`}
            target="_blank"
          >
            {trimHexAddress(cctx.index)}
            <RedirectIcon className="redirect-icon" />
          </a>
        </Typography>
      </FlexRowWrapper>

      <Typography size={14}>
        Amount:&nbsp;
        {parseFloat('' + cctx.inbound_tx_params.amount / 1e18).toFixed(18)} ZETA
      </Typography>

      <FlexRowWrapper className="flex-row">
        <Typography size={14}>
          <>
            Sender:{' '}
            <a
              href={`https://mempool.space/testnet/address/${cctx.outbound_tx_params[0].receiver}`}
              target="_blank"
            >
              {trimHexAddress(cctx.outbound_tx_params?.[0].receiver)}
              <RedirectIcon className="redirect-icon" />
            </a>
          </>
        </Typography>
      </FlexRowWrapper>

      <FlexRowWrapper className="flex-row">
        <Typography size={14} color="#fff">
          CCTX Status: {cctx?.inbound_tx_params?.tx_finalization_status}
        </Typography>
      </FlexRowWrapper>
      {/* <FlexRowWrapper className="flex-row">
        <Typography size={12} color="#4e4">
          Message: {cctx?.cctx_status?.status_message}
        </Typography>
      </FlexRowWrapper> */}
    </CctxItemWrapper>
  );
};

export default CctxItem;
