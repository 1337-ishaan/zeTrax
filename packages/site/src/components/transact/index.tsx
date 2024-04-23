import React from 'react';
import styled from 'styled-components';
import Arrow from '../utils/Arrow';
import Typography from '../utils/Typography';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import ReceiveModal from './modals/ReceiveModal';
import SendModal from './modals/SendModal';

const TransactWrapper = styled(FlexRowWrapper)`
  column-gap: 24px;
  .user-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #eeeeee34;
    height: fit-content;
    min-width: 80px;
    padding: 24px;
    cursor: pointer;
    &:hover {
      border: 1px solid #fff;
    }
  }
`;

const Transact = () => {
  const [isSendModalOpen, setIsSendModalOpen] = React.useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = React.useState(false);

  return (
    <TransactWrapper>
      <div className="user-action" onClick={() => setIsSendModalOpen(true)}>
        <Arrow />
        <Typography size={24}>Send</Typography>
      </div>
      <div className="user-action" onClick={() => setIsReceiveModalOpen(true)}>
        <Arrow isReceived={true} />
        <Typography size={24}>Receive</Typography>
      </div>
      <SendModal
        isSendModalOpen={isSendModalOpen}
        setIsSendModalOpen={setIsSendModalOpen}
      />
      <ReceiveModal
        isReceiveModalOpen={isReceiveModalOpen}
        setIsReceiveModalOpen={setIsReceiveModalOpen}
      />
    </TransactWrapper>
  );
};

export default Transact;
