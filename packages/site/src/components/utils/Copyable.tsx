import styled from 'styled-components/macro';
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
import { ReactComponent as CheckIcon } from '../../assets/check.svg';
import { useState } from 'react';
import { toast } from 'react-toastify';

const CopyableWrapper = styled.div`
  background: rgba(0, 0, 0, 1);
  padding: 6px 8px;
  border-radius: 8px;

  cursor: pointer;
  font-size: 14px;
  margin-top: 4px;
  width: fit-content;
  color: #fff;
  display: flex;
  align-items: center;
  border-radius: ${(props) => props.theme.borderRadius};
  .copy-icon {
    width: 16px;
    height: 16px;
  }
`;

interface CopyableProps {
  children: any;
}

const Copyable = ({ children }: CopyableProps): JSX.Element => {
  const [isCopying, setIsCopying] = useState(false);

  const copy = () => {
    try {
      setIsCopying(true);
      navigator.clipboard.writeText(children);
    } catch {
      setIsCopying(false);
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

  return (
    <CopyableWrapper onClick={copy}>
      {children} &nbsp;
      {isCopying ? (
        <CheckIcon className="copy-icon" />
      ) : (
        <CopyIcon className="copy-icon" />
      )}
    </CopyableWrapper>
  );
};

export default Copyable;
