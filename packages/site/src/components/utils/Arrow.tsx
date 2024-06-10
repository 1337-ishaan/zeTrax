import styled from 'styled-components';
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg';

const ArrowWrapper = styled(ArrowIcon)<{ isReceived: boolean }>`
  transform: ${(props) => (props.isReceived ? 'rotateZ(180deg)' : 'unset')};
  height: 28px;
  padding: 4px;
  border-radius: 12px;
  width: 28px;
  color: ${(props) => (props.isReceived ? '#008462' : '#ff4a3d')};
`;

interface ArrowProps {
  isReceived?: boolean;
  onClick?: any;
}

const Arrow = ({ isReceived = false, onClick }: ArrowProps): JSX.Element => {
  return <ArrowWrapper isReceived={isReceived} onClick={onClick} />;
};

export default Arrow;
