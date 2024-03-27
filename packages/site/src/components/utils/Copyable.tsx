import styled from 'styled-components/macro';

const CopyableWrapper = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 4px;
  width: fit-content;
`;

interface CopyableProps {
  children: any;
}

const Copyable = ({ children }: CopyableProps): JSX.Element => {
  const copy = () => {
    navigator.clipboard.writeText(children);
    window.alert('Copied');
  };

  return <CopyableWrapper onClick={copy}>{children}</CopyableWrapper>;
};

export default Copyable;
