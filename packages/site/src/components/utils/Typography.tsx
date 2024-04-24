import styled from 'styled-components/macro';

const TypographyWrapper = styled.div<{
  color: string;
  size?: number | null;
  weight?: number | null;
}>`
  font-weight: ${(props) => (props.weight ? props.weight : 600)};
  color: ${(props) => props.color};
  cursor: pointer;
  font-size: ${(props) => (props.size ? props.size : '24')}px;
`;

interface TypographyProps {
  children: string | JSX.Element | any;
  color?: string;
  size?: number | null;
  weight?: number | null;
  className?: string;
  onClick?: () => void;
}

const Typography = ({
  children,
  color = '#fff',
  onClick,
  size = null,
  className,
  weight = null,
}: TypographyProps): JSX.Element => {
  return (
    <TypographyWrapper
      className={className}
      color={color}
      size={size}
      weight={weight}
      onClick={onClick}
    >
      {children}
    </TypographyWrapper>
  );
};

export default Typography;
