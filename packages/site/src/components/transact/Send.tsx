import styled from 'styled-components/macro';
import StyledInput from '../utils/StyledInput';
import Typography from '../utils/Typography';
import { useEffect, useState } from 'react';
import StyledButton from '../utils/StyledButton';
import { getBtcFees, transferBtc } from '../../utils/snap';
import useAccount from '../../hooks/useAccount';
import Select from 'react-dropdown-select';
import axios from 'axios';
import { getChainIcon } from '../../constants/getChainIcon';
import { ReactComponent as GasIcon } from '../../assets/gas.svg';

import InfoBox from '../utils/InfoBox';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import { toast } from 'react-toastify';

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
    width: 100%;
  }
  .dropdown-item {
    padding: 10px;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${(props) => props.theme.colors.background!.default};
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
    column-gap: 8px;
    justify-content: end;
    .icon {
      width: 16px;
    }
    .amount {
      font-size: 16px;
    }
  }

  .priority-wrapper {
    justify-content: space-evenly;
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid white;
    padding: 12px;
    width: 94%;
    margin: auto;
    column-gap: 8px;

    .priority-item {
      row-gap: 8px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      width: 100%;
      padding: 4px 8px;
      border-radius: ${(props) => props.theme.borderRadius};

      &:hover {
        background: rgba(44, 43, 43, 0.892);
      }
      &.selected {
        background: rgba(54, 54, 54, 92);
      }
    }
    .vertical-divider {
      height: 50px;
      width: 1px;
      background-color: #ffffff4e;
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
  const [isTrxProcessing, setIsTrxProcessing] = useState(false);
  const [selectedGasPriority, setSelectedGasPriority] = useState<
    'low' | 'medium' | 'high'
  >('low');

  const [depositFees, setDepositFees] = useState<any>();

  const sendTrx = async () => {
    setIsTrxProcessing(true);
    toast('Processing...', {
      hideProgressBar: false,
    });
    try {
      await transferBtc(
        recipentAddress!,
        selectedZrc20.zrc20_contract_address,
        amount,
        address as string,
        selectedGasPriority,
      );
    } catch (e: any) {
      setIsTrxProcessing(true);
      toast(`Error: ${e?.message}`, {
        hideProgressBar: false,
      });
    } finally {
      setIsTrxProcessing(true);
    }
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

  useEffect(() => {
    if (!depositFees) {
      const getFees = async () => {
        let fees: any = await getBtcFees();
        setDepositFees(fees);
      };
      getFees();
      return () => {};
    }
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

  return (
    <SendWrapper>
      <FlexRowWrapper className="transfer-types-wrapper">
        <Typography
          onClick={() => setCurrentActive('zeta')}
          color={currentActive === 'zeta' ? '#fff' : '#b1cfc1'}
        >
          Deposit to ZetaChain
        </Typography>
        <Typography
          onClick={() => setCurrentActive('cctx')}
          color={currentActive === 'cctx' ? '#fff' : '#b1cfc1'}
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

      <FlexRowWrapper className="priority-wrapper">
        <FlexColumnWrapper
          onClick={() => setSelectedGasPriority('low')}
          className={`priority-item ${
            selectedGasPriority === 'low' && 'selected'
          }`}
        >
          <Typography color="#ff4a3d" size={16}>
            Low
          </Typography>
          <Typography color="#ff4a3d" size={14}>
            ~{depositFees?.low_fee_per_kb} sats
          </Typography>
        </FlexColumnWrapper>
        <div className="vertical-divider" />
        <FlexColumnWrapper
          className={`priority-item ${
            selectedGasPriority === 'medium' && 'selected'
          }`}
          onClick={() => setSelectedGasPriority('medium')}
        >
          <Typography color="#eded4c" size={16}>
            Medium
          </Typography>
          <Typography color="#eded4c" size={14}>
            ~{depositFees?.medium_fee_per_kb} sats
          </Typography>
        </FlexColumnWrapper>
        <div className="vertical-divider" />

        <FlexColumnWrapper
          className={`priority-item ${
            selectedGasPriority === 'high' && 'selected'
          }`}
          onClick={() => setSelectedGasPriority('high')}
        >
          <Typography color="#008462" size={16}>
            High
          </Typography>
          <Typography color="#008462" size={14}>
            ~{depositFees?.high_fee_per_kb} sats
          </Typography>{' '}
        </FlexColumnWrapper>
      </FlexRowWrapper>

      <FlexRowWrapper className="gas-wrapper">
        <GasIcon className="icon" /> Fees :
        <span className="amount">~10000 sats</span>
      </FlexRowWrapper>
      <StyledButton
        disabled={
          currentActive === 'zeta' ? !amount : !amount || !selectedZrc20
        }
        onClick={sendTrx}
      >
        {isTrxProcessing ? 'Sending...' : 'Send'}
      </StyledButton>
    </SendWrapper>
  );
};

export default Send;
