import styled from 'styled-components/macro';
import StyledInput from '../utils/StyledInput';
import Dropdown from 'react-dropdown';
import Typography from '../utils/Typography';
import { useEffect, useState } from 'react';
import StyledButton from '../utils/StyledButton';
import { transferBtc } from '../../utils/snap';
import useAccount from '../../hooks/useAccount';
import Select from 'react-dropdown-select';
import { options } from '../../constants/dropdownOptions';
import axios from 'axios';
import { getChainIcon } from '../../constants/getChainIcon';
//@ts-ignore

const SendWrapper = styled.div`
  display: flex;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  width: 40%;
  color: #dadada;
  padding: 40px 80px 80px 40px;
  overflow-y: auto;
  height: fit-content;
  flex-direction: column;
  gap: 12px;
  .flex1 {
    display: flex;
    color: white;
    flex-direction: row;
    justify-content: flex-start;
    column-gap: 8px;
  }
  .dropdown-item {
    padding: 10px;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2c2c2e;

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
  .css-1uslfsx-DropDown {
    border: none !important;
  }
  /* .css-wmy1p7-ReactDropdownSelect {
    border: none !important;
  } */
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

  // const getSupportedChains = async () => {
  //   let assets = await axios.get(
  //     'https://zetachain-athens.blockpi.network/lcd/v1/public/zeta-chain/fungible/foreign_coins',
  //   );
  //   setZrc20Assets(assets.data.foreignCoins);
  //   return assets;
  // };

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

  console.log(trxInput, zrc20Assets, 'trx input');

  const CustomItemRenderer = ({ option }: any) => (
    <div className="dropdown-item">
      <div className="icon-symbol-wrapper">
        <img
          //@ts-ignore
          src={getChainIcon(+option.foreign_chain_id)}
          alt={option.symbol}
          className="dropdown-image"
        />
        <span>{option.symbol}</span> - <span>{option.coin_type}</span>
      </div>
    </div>
  );

  console.log(zrc20Assets, 'recipent addre');
  return (
    <SendWrapper>
      <div className="flex1">
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
      </div>
      {/* <Select
        options={options}
        contentRenderer={({ props, state }) => (
          <div key={trxInput.key}>
            <CustomItemRenderer option={trxInput} />
          </div>
        )}
        itemRenderer={({ item, itemIndex, props, state, methods }) => (
          <div key={itemIndex} onClick={() => methods.addItem(item)}>
            <CustomItemRenderer option={item} />
          </div>
        )}
        values={[]}
        onChange={(e) => setSelectedZrc20(e)}
        placeholder="Select an option"
      /> */}
      {currentActive === 'cctx' && (
        <Select
          options={zrc20Assets}
          contentRenderer={({ props, state }) => (
            <div key={trxInput.key}>
              <CustomItemRenderer option={selectedZrc20} />
            </div>
          )}
          valueField="symbol"
          itemRenderer={({ item, itemIndex, props, state, methods }: any) => (
            <div key={itemIndex} onClick={() => methods.addItem(item)}>
              {/* <div>{item.symbol}</div> */}
              <CustomItemRenderer option={item} />
            </div>
          )}
          values={zrc20Assets[0]}
          onChange={(e) => setSelectedZrc20(e[0])}
          placeholder="Select an option"
        />
      )}
      <div className="flex1">
        {currentActive === 'cctx' && (
          <StyledInput
            placeholder="Wallet address"
            onChange={(e: any) => setRecipentAddress(e.target.value)}
          />
        )}
        <StyledInput
          onChange={(e: any) => setAmount(e.target.value)}
          type="number"
          min={0.1}
          placeholder="Amount"
        />
      </div>
      <StyledButton onClick={sendTrx}>Send</StyledButton>
    </SendWrapper>
  );
};

export default Send;
