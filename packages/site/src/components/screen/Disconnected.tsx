import styled from 'styled-components/macro';
import Typography from '../utils/Typography';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';

const DisconnectedWrapper = styled(FlexRowWrapper)`
  /* border: 1px solid red; */
  min-height: 60vh;
  /* margin: auto; */

  align-items: center;
  justify-content: center;
`;

interface DisconnectedProps {}

const Disconnected = ({}: DisconnectedProps): JSX.Element => {
  return (
    <DisconnectedWrapper>
      <Typography>
        Kindly install zeTrax and connect your wallet by clicking the "Install
        zeTrax" button to proceed.
      </Typography>
    </DisconnectedWrapper>
  );
};

export default Disconnected;