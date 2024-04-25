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
    border-radius: ${(props) => props.theme.borderRadius};
    transition: all 0.3s;

    &:hover {
      transform: scale(1.2);
      border: 1px solid #fff;
      transition: all 0.3s;
      box-shadow: 0px 0px 21px 5px rgba(0, 0, 0, 1);
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
