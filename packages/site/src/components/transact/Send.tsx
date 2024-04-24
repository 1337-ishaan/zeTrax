import styled from 'styled-components/macro';
import StyledInput from '../utils/StyledInput';
import Typography from '../utils/Typography';
import { useEffect, useState } from 'react';
import StyledButton from '../utils/StyledButton';
import { transferBtc } from '../../utils/snap';
import useAccount from '../../hooks/useAccount';
import Select from 'react-dropdown-select';
import axios from 'axios';
import { getChainIcon } from '../../constants/getChainIcon';
import { ReactComponent as GasIcon } from '../../assets/gas.svg';

import InfoBox from '../utils/InfoBox';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';

const SendWrapper = styled.div`
  display: flex;
  border-radius: 12px;
  padding: 40px;
  overflow-y: auto;
  color: #fff;
  height: fit-content;
  flex-direction: column;
  gap: 24px;
  background: ${(props) => props.theme.colors.background!.default};
  .inputs-wrapper {
    color: white;
    row-gap: 12px;
  }
  .dropdown-item {
    padding: 10px;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 1);
    .icon-symbol-wrapper {
      display: flex;
      align-items: center;
    }
    .dropdown-image {
      margin-right: 5px;
      width: 24px;
      height: 24px;
    }
  }
  .transfer-types-wrapper {
    column-gap: 24px;
  }
  .css-1uslfsx-DropDown {
    border: none !important;
  }
  .gas-wrapper {
    display: flex;
    column-gap: 8px;
    justify-content: end;
    .icon {
      width: 16px;
    }
    .amount {
      font-size: 16px;
    }
  }
`;

interface SendProps {}

const Send = ({}: SendProps): JSX.Element => {
  const [trxInput, setTrxInput] = useState<any>({});
  const [currentActive, setCurrentActive] = useState('zeta');
  const { address } = useAccount(true);
  const [zrc20Assets, setZrc20Assets] = useState<any>();
  const [selectedZrc20, setSelectedZrc20] = useState<any>('');
  const [amount, setAmount] = useState(0);
  const [recipentAddress, setRecipentAddress] = useState<any>('');

  const sendTrx = async () => {
    await transferBtc(
      recipentAddress!,
      selectedZrc20.zrc20_contract_address,
      amount,
      address as string,
    );
  };

  const getZrc20Assets = async () => {
    let assets = await axios.get(
      'https://zetachain-athens.blockpi.network/lcd/v1/public/zeta-chain/fungible/foreign_coins',
    );
    setZrc20Assets(assets.data.foreignCoins);
    return assets;
  };

  useEffect(() => {
    getZrc20Assets();
  }, []);

  const CustomItemRenderer = ({ option }: any) => (
    <div className="dropdown-item">
      <div className="icon-symbol-wrapper">
        <img
          //@ts-ignore
          src={getChainIcon(+option.foreign_chain_id)}
          alt={option.symbol}
          className="dropdown-image"
        />
        <span>{option.symbol ?? 'Select Asset'}</span>
      </div>
    </div>
  );

  console.log(selectedZrc20, 'selected');
  return (
    <SendWrapper>
      <FlexRowWrapper className="transfer-types-wrapper">
        <Typography
          onClick={() => setCurrentActive('zeta')}
          color={currentActive === 'zeta' ? 'fff' : '#b1cfc1'}
        >
          Deposit to ZetaChain
        </Typography>
        <Typography
          onClick={() => setCurrentActive('cctx')}
          color={currentActive === 'cctx' ? 'fff' : '#b1cfc1'}
        >
          Cross Chain
        </Typography>
      </FlexRowWrapper>
      {currentActive === 'cctx' && (
        <Select
          options={zrc20Assets}
          contentRenderer={({ props, state }: any) => (
            <div key={trxInput.key}>
              <>
                <CustomItemRenderer option={selectedZrc20} />
              </>
            </div>
          )}
          valueField="symbol"
          itemRenderer={({ item, itemIndex, props, state, methods }: any) => (
            <div key={itemIndex} onClick={() => methods.addItem(item)}>
              <CustomItemRenderer option={item} />
            </div>
          )}
          values={zrc20Assets[1]?.symbol}
          onChange={(e) => setSelectedZrc20(e[0])}
          placeholder="Select an option"
        />
      )}
      <FlexColumnWrapper className="inputs-wrapper">
        <StyledInput
          placeholder="Recipent Address (Optional)"
          onChange={(e: any) => setRecipentAddress(e.target.value)}
        />
        <StyledInput
          onChange={(e: any) => setAmount(e.target.value)}
          type="number"
          min={0.00000000001}
          placeholder="Amount"
        />
      </FlexColumnWrapper>
      <InfoBox>
        {currentActive === 'zeta'
          ? 'Deposit BTC to ZetaChain either to specified recipent address, if recipent address is not mentioned the assets will be transferred to connected wallet address'
          : 'Cross chain transfer BTC to ZetaChain either to specified recipent address, if recipent address is not mentioned the assets will be transferred to connected wallet address'}
      </InfoBox>

      <div className="gas-wrapper">
        <GasIcon className="icon" /> Fees :
        <span className="amount">12 zeta</span>
      </div>
      <StyledButton onClick={sendTrx}>Send</StyledButton>
    </SendWrapper>
  );
};

export default Send;
