import styled from 'styled-components/macro';

const TypographyWrapper = styled.div<{ color: string }>`
  font-weight: bold;
  font-size: 24px;
  margin: 16px 0;
  color: ${(props) => props.color};
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
