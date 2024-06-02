import styled from 'styled-components/macro';
import Modal from 'react-modal';
import Send from '../Send';
import { ReactComponent as CrossIcon } from '../../../assets/cross.svg';

import useAccount from '../../../hooks/useAccount';
import { useContext, useState } from 'react';
import { MetaMaskContext } from '../../../hooks';
import QRCode from 'react-qr-code';
import Typography from '../../../components/utils/Typography';
import Copyable from '../../../components/utils/Copyable';
import FlexColumnWrapper from '../../../components/utils/wrappers/FlexColumnWrapper';
import FlexRowWrapper from '../../../components/utils/wrappers/FlexWrapper';

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
  const { btcAddress, address } = useAccount(true, 'ReceiveModal');
  const [selectedAddressType, setSelectedAddressType] = useState<'BTC' | 'EVM'>(
    'BTC',
  );
  return (
    <ReceiveModalWrapper>
      {btcAddress && (
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
              width: 'fit-content',
              transition: '.5s all',
            }}
          >
            <FlexRowWrapper
              style={{ justifyContent: 'space-evenly', alignItems: 'center' }}
              className="address-type-wrapper"
            >
              <FlexColumnWrapper onClick={() => setSelectedAddressType('EVM')}>
                <Typography
                  color={selectedAddressType === 'EVM' ? '#fff' : '#a49f9f'}
                  size={selectedAddressType === 'EVM' ? 24 : 22}
                >
                  EVM
                </Typography>
              </FlexColumnWrapper>
              <div
                style={{ height: '24px', width: '.1px', background: '#fff' }}
              />
              <FlexColumnWrapper onClick={() => setSelectedAddressType('BTC')}>
                <Typography
                  color={selectedAddressType === 'BTC' ? '#fff' : '#a49f9f'}
                  size={selectedAddressType === 'BTC' ? 24 : 22}
                >
                  BTC
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
              value={selectedAddressType === 'BTC' ? btcAddress : address!}
            />
            <Copyable>
              {selectedAddressType === 'BTC' ? btcAddress : address!}
            </Copyable>
          </div>
        </Modal>
      )}
    </ReceiveModalWrapper>
  );
};

export default ReceiveModal;
