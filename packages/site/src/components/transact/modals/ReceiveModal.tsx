import styled from 'styled-components/macro';
import Modal from 'react-modal';
import Send from '../Send';
import { ReactComponent as CrossIcon } from '../../../assets/cross.svg';

import useAccount from '../../../hooks/useAccount';
import { useContext } from 'react';
import { MetaMaskContext } from '../../../hooks';
import QRCode from 'react-qr-code';
import Typography from '../../../components/utils/Typography';
import Copyable from '../../../components/utils/Copyable';

const ReceiveModalWrapper = styled.div`
  position: relative;
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
  const { btcAddress } = useAccount(true);
  return (
    <ReceiveModalWrapper>
      {btcAddress && (
        <Modal style={customStyles} isOpen={isReceiveModalOpen}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '8px',
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#626060',
              padding: '16px',
              width: 'fit-content',
            }}
          >
            <CrossIcon
              onClick={() => setIsReceiveModalOpen(false)}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: 20,
                height: '16px',
                width: '16px',
                right: 20,
              }}
            />
            <Typography color="#fff" size={24}>
              Receive BTC
            </Typography>
            <QRCode style={{ padding: '8px' }} value={btcAddress} />
            <Copyable>{btcAddress}</Copyable>
          </div>
        </Modal>
      )}
    </ReceiveModalWrapper>
  );
};

export default ReceiveModal;
