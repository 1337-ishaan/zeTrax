import styled from 'styled-components/macro';
import Modal from 'react-modal';
import Send from '../Send';
import { ReactComponent as CrossIcon } from '../../../assets/cross.svg';
import { ReactComponent as BitcoinIcon } from '../../../assets/bitcoin.svg';
import { ReactComponent as ZetaChainIcon } from '../../../assets/zetachain.svg';

import { useContext, useState } from 'react';
import { MetaMaskContext } from '../../../hooks';
import QRCode from 'react-qr-code';
import Typography from '../../../components/utils/Typography';
import Copyable from '../../../components/utils/Copyable';
import FlexColumnWrapper from '../../../components/utils/wrappers/FlexColumnWrapper';
import FlexRowWrapper from '../../../components/utils/wrappers/FlexWrapper';
import { StoreContext } from '../../../hooks/useStore';

const ReceiveModalWrapper = styled.div`
  position: relative;

  .address-type-wrapper {
    justify-content: space-around;
  }
`;

interface ReceiveModalProps {
  isReceiveModalOpen: boolean;
  setIsReceiveModalOpen: any;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 0,

    background: 'transparent',
    border: 'none',
  },
};

const ReceiveModal = ({
  isReceiveModalOpen,
  setIsReceiveModalOpen,
}: ReceiveModalProps): JSX.Element => {
  const { globalState } = useContext(StoreContext);
  const [selectedAddressType, setSelectedAddressType] = useState<'BTC' | 'EVM'>(
    'BTC',
  );
  return (
    <ReceiveModalWrapper>
      {globalState?.btcAddress && (
        <Modal style={customStyles} isOpen={isReceiveModalOpen}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '16px',
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#141417',

              padding: '16px',
              width: '400px',
              transition: '.5s all',
            }}
          >
            <FlexRowWrapper
              style={{
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
              className="address-type-wrapper"
            >
              <FlexColumnWrapper
                onClick={() => setSelectedAddressType('EVM')}
                style={{
                  background: '#474747e4',

                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
              >
                <Typography
                  className="type-button"
                  color={selectedAddressType === 'EVM' ? '#fff' : '#a49f9f'}
                  size={selectedAddressType === 'EVM' ? 24 : 22}
                >
                  ZETA <ZetaChainIcon />
                </Typography>
              </FlexColumnWrapper>
              <div
                style={{ height: '24px', width: '.1px', background: '#fff' }}
              />
              <FlexColumnWrapper
                onClick={() => setSelectedAddressType('BTC')}
                style={{
                  background: '#474747e4',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
              >
                <Typography
                  className="type-button"
                  color={selectedAddressType === 'BTC' ? '#fff' : '#a49f9f'}
                  size={selectedAddressType === 'BTC' ? 24 : 22}
                >
                  BTC <BitcoinIcon />
                </Typography>{' '}
              </FlexColumnWrapper>
            </FlexRowWrapper>

            <CrossIcon
              onClick={() => setIsReceiveModalOpen(false)}
              style={{
                color: '#fff',
                cursor: 'pointer',
                position: 'absolute',
                top: 20,
                height: '16px',
                width: '16px',
                right: 20,
              }}
            />
            <Typography color="#fff" size={24}>
              Receive {selectedAddressType === 'BTC' ? 'BTC' : 'ZETA'}
            </Typography>
            <QRCode
              style={{ border: '4px solid #fff' }}
              value={
                selectedAddressType === 'BTC'
                  ? globalState?.btcAddress
                  : globalState?.evmAddress!
              }
            />
            <Copyable>
              {selectedAddressType === 'BTC'
                ? globalState?.btcAddress
                : globalState?.evmAddress!}
            </Copyable>
          </div>
        </Modal>
      )}
    </ReceiveModalWrapper>
  );
};

export default ReceiveModal;
