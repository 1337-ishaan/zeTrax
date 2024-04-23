import styled from 'styled-components/macro';
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';

const CopyableWrapper = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 4px;
  width: fit-content;
  color: #fff;
  display: flex;
  align-items: center;
  .copy-icon {
    width: 16px;
    height: 16px;
  }
`;

interface CopyableProps {
  children: any;
}

const Copyable = ({ children }: CopyableProps): JSX.Element => {
  const copy = () => {
    navigator.clipboard.writeText(children);
    window.alert('Copied');
  };

  return (
    <CopyableWrapper onClick={copy}>
      {children} &nbsp; <CopyIcon className="copy-icon" />
    </CopyableWrapper>
  );
};

export default Copyable;
