import styled from 'styled-components/macro';

const TypographyWrapper = styled.div<{ color: string; size?: number | null }>`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 8px;
  color: ${(props) => props.color};
  cursor: pointer;
  font-size: ${(props) => (props.size ? props.size : 'unset')}px;
`;

interface TypographyProps {
  children: string | JSX.Element;
  color?: string;
  size?: number | null;
  onClick?: () => void;
}

const Typography = ({
  children,
  color = '#fff',
  onClick,
  size = null,
}: TypographyProps): JSX.Element => {
  return (
    <TypographyWrapper color={color} size={size} onClick={onClick}>
      {children}
    </TypographyWrapper>
  );
};

export default Typography;
