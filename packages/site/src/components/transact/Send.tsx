import styled from 'styled-components/macro';
import StyledInput from '../utils/StyledInput';
import Dropdown from 'react-dropdown';
import Typography from '../utils/Typography';
import { useState } from 'react';
import StyledButton from '../utils/StyledButton';
import {
  crossChainSwapBTCHandle,
  demonstrateCctx,
  sendBtc,
} from '../../utils/snap';
import useAccount from '../../hooks/useAccount';

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
  const { address, btcAddress } = useAccount();
  const getBalance = async () => {
    // await demonstrateCctx();
    await crossChainSwapBTCHandle(address!, btcAddress!);
    // console.log('get balance');
  };
  const [currentActive, setCurrentActive] = useState('deposit');

  return (
    <SendWrapper>
      <div className="flex1">
        <Typography
          onClick={() => setCurrentActive('deposit')}
          color={currentActive === 'deposit' ? 'fff' : '#b1cfc1'}
        >
          Deposit BTC
        </Typography>
        <Typography
          onClick={() => setCurrentActive('withdraw')}
          color={currentActive === 'withdraw' ? 'fff' : '#b1cfc1'}
        >
          Withdraw BTC
        </Typography>
        <Typography
          onClick={() => setCurrentActive('withdraw')}
          color={currentActive === 'withdraw' ? 'fff' : '#b1cfc1'}
        >
          Swap
        </Typography>
      </div>
      <Dropdown
        options={['ZetaChain', 'Ethereum', 'Polygon', 'BNB']}
        onChange={() => console.log('change')}
        value={'ZetaChain'}
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
