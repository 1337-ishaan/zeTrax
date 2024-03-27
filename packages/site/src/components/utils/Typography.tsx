import styled from 'styled-components/macro';

const TypographyWrapper = styled.div<{ color: string }>`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 16px;
  color: ${(props) => props.color};
  cursor: pointer;
`;

interface TypographyProps {
  children: string;
  color?: string;
  onClick?: () => void;
}

const Typography = ({
  children,
  color = '#fff',
  onClick,
}: TypographyProps): JSX.Element => {
  return (
    <TypographyWrapper color={color} onClick={onClick}>
      {children}
    </TypographyWrapper>
  );
};

export default Typography;
