import React from 'react';
import styled from 'styled-components/macro';
import { trimHexAddress } from '../../utils/trimHexAddr';
import { getChainIcon } from '../../constants/getChainIcon';

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
    justify-content: space-evenly;
  }
`;

interface CctxItemProps {
  cctx: any;
}

const CctxItem = ({ cctx }: CctxItemProps): JSX.Element => {
  return (
    <CctxItemWrapper>
      <>
        <div>
          <div className="flex-row">
            Trx:{' '}
            <a
              href={`https://athens.explorer.zetachain.com/cc/tx/${cctx.index}`}
              target="_blank"
            >
              {trimHexAddress(cctx.index)}
            </a>
          </div>
        </div>
        <div>
          Amount:&nbsp;
          {parseFloat('' + cctx.inbound_tx_params.amount / 1e18).toFixed(18)}
        </div>

        <div>
          <div className="chain-swap">
            <img
              // @ts-ignore
              src={getChainIcon(+cctx.inbound_tx_params.sender_chain_id)}
              alt=""
            />
            {'-->'}
            <img
              // @ts-ignore
              src={getChainIcon(+cctx.outbound_tx_params?.[0].receiver_chainId)}
              alt=""
            />
          </div>
          <div className="flex-row">
            Trx:{' '}
            <a
              href={`https://mempool.space/testnet/address/${cctx.outbound_tx_params[0].receiver}`}
              target="_blank"
            >
              {trimHexAddress(cctx.outbound_tx_params?.[0].receiver)}
            </a>
          </div>
        </div>
      </>
    </CctxItemWrapper>
  );
};

export default CctxItem;
