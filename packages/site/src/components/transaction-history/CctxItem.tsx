import React from 'react';
import styled from 'styled-components/macro';
import { trimHexAddress } from '../../utils/trimHexAddr';
import { getChainIcon } from '../../constants/getChainIcon';
import Typography from '../utils/Typography';
import { ReactComponent as RightArrow } from '../../assets/right-arrow.svg';

const CctxItemWrapper = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 12px;
  a {
    color: #eee;
    font-size: 16px;
  }
  .flex-row {
    column-gap: 6px;
    display: flex;
  }
  .chain-swap {
    display: flex;
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
`;

interface CctxItemProps {
  cctx: any;
}

const CctxItem = ({ cctx }: CctxItemProps): JSX.Element => {
  console.log(cctx, 'cctx');
  return (
    <CctxItemWrapper>
      <>
        <div>
          <Typography color="#a9a8a8" size={18}>
            ZetaChain CCTX transaction
          </Typography>
          <div className="chain-swap">
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
          </div>
          <div className="flex-row trx-row-text">
            <Typography size={14}>
              <>
                ZetaScan:{' '}
                <a
                  href={`https://athens.explorer.zetachain.com/cc/tx/${cctx.index}`}
                  target="_blank"
                >
                  {trimHexAddress(cctx.index)}
                </a>
              </>
            </Typography>
          </div>
        </div>

        <Typography size={14}>
          <>
            Amount:&nbsp;
            {parseFloat('' + cctx.inbound_tx_params.amount / 1e18).toFixed(
              18,
            )}{' '}
            ZETA
          </>
        </Typography>

        <div>
          <div className="flex-row">
            <Typography size={14}>
              <>
                Sender:{' '}
                <a
                  href={`https://mempool.space/testnet/address/${cctx.outbound_tx_params[0].receiver}`}
                  target="_blank"
                >
                  {trimHexAddress(cctx.outbound_tx_params?.[0].receiver)}
                </a>
              </>
            </Typography>
          </div>
          <div className="flex-row">
            <Typography size={14} color="#fff">
              <>
                CCTX Status: {cctx?.inbound_tx_params?.tx_finalization_status}
              </>
            </Typography>
          </div>
          <div className="flex-row">
            <Typography size={12} color="#4e4">
              <>Message: {cctx?.cctx_status?.status_message}</>
            </Typography>
          </div>
        </div>
      </>
    </CctxItemWrapper>
  );
};

export default CctxItem;
