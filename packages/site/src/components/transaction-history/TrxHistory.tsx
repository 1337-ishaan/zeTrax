import React from 'react';
import styled from 'styled-components';
import Typography from '../utils/Typography';
import TrxRow from './TrxRow';

const TrxHistoryWrapper = styled.div`
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  width: fit-content;
  color: #dadada;
  padding: 20px 40px;
  max-height: 70vh;
  overflow-y: auto;
`;

interface TrxHistoryInterface {}

const TrxHistory = (_: TrxHistoryInterface) => {
  return (
    <TrxHistoryWrapper>
      <Typography>Transactions</Typography>
      {new Array(12).fill(0).map((i) => (
        <TrxRow />
      ))}
    </TrxHistoryWrapper>
  );
};

export default TrxHistory;
