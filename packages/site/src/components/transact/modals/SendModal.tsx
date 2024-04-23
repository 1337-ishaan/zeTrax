import styled from 'styled-components/macro';
import Modal from 'react-modal';
import Send from '../Send';
import { ReactComponent as CrossIcon } from '../../../assets/cross.svg';

const SendModalWrapper = styled.div`
  position: relative;
`;

interface SendModalProps {
  isSendModalOpen: boolean;
  setIsSendModalOpen: any;
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

const SendModal = ({
  isSendModalOpen,
  setIsSendModalOpen,
}: SendModalProps): JSX.Element => {
  return (
    <SendModalWrapper>
      <Modal style={customStyles} isOpen={isSendModalOpen}>
        <CrossIcon
          onClick={() => setIsSendModalOpen(false)}
          style={{
            cursor: 'pointer',
            color: '#eeeeeecc',
            position: 'absolute',
            top: 15,
            height: '16px',
            left: 50,
          }}
        />
        <Send />
      </Modal>
    </SendModalWrapper>
  );
};

export default SendModal;
