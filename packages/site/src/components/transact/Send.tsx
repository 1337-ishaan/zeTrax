import styled from 'styled-components/macro';
import StyledInput from '../utils/StyledInput';
import Dropdown from 'react-dropdown';
import Typography from '../utils/Typography';
import { useState } from 'react';
import StyledButton from '../utils/StyledButton';
//@ts-ignore

const SendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  gap: 12px;
  .flex1 {
    display: flex;
    color: white;
    flex-direction: row;
    justify-content: flex-start;
    column-gap: 8px;
  }
`;

interface SendProps {}

const Send = ({}: SendProps): JSX.Element => {
  const getBalance = async () => {};
  const [currentActive, setCurrentActive] = useState('deposit');

  return (
    <SendWrapper>
      <div className="flex1">
        <Typography
          onClick={() => setCurrentActive('deposit')}
          color={currentActive === 'deposit' ? 'fff' : '#b1cfc1'}
        >
          Deposit
        </Typography>
        <Typography
          onClick={() => setCurrentActive('withdraw')}
          color={currentActive === 'withdraw' ? 'fff' : '#b1cfc1'}
        >
          Withdraw
        </Typography>
      </div>
      <Dropdown
        options={['1', '2', '3', '4']}
        onChange={() => console.log('change')}
        value={'1'}
        placeholder="Select an option"
      />
      <div className="flex1">
        <StyledInput placeholder="wallet address" />
        <StyledInput placeholder="amount" />
      </div>
      <StyledButton onClick={getBalance}>fet</StyledButton>
    </SendWrapper>
  );
};

export default Send;
