import { trimHexAddress } from '../../utils/trimHexAddr';
import styled from 'styled-components/macro';
import Arrow from '../utils/Arrow';
import * as zeta from '@zetachain/toolkit/dist/helpers';

const TrxRowWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
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
}

const TrxRow = ({ trx }: TrxRowProps): JSX.Element => {
  return (
    <TrxRowWrapper>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://mempool.space/testnet/tx/${trx.hash}`}
      >
        <div>
          <Arrow isReceived={true} />
        </div>
        <div className="info-column">
          <div>Received</div>
          <div>
            From: {trimHexAddress('0x70991c20c7C4e0021Ef0Bd3685876cC3aC5251F0')}
          </div>
        </div>
        <div className="info-column">
          {' '}
          <div>{trx.total} BTC</div>
          <div>{trx.confirmations}</div>
        </div>
      </a>
    </TrxRowWrapper>
  );
};

export default TrxRow;
