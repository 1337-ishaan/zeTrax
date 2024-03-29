import styled from 'styled-components';
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg';

const ArrowWrapper = styled(ArrowIcon)<{ isReceived: boolean }>`
  transform: ${(props) => (props.isReceived ? 'rotateZ(180deg)' : 'unset')};
  height: 28px;
  padding: 4px;

  /* background: #eee; */
  border-radius: 12px;
  width: 28px;
  color: ${(props) => (props.isReceived ? 'green' : 'red')};
`;

interface ArrowProps {
  isReceived?: boolean;
}

const Arrow = ({ isReceived = false }: ArrowProps): JSX.Element => {
  return <ArrowWrapper isReceived={isReceived} />;
};

export default Arrow;
