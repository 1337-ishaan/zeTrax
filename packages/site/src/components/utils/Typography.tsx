import styled from 'styled-components/macro';

const TypographyWrapper = styled.div<{ color: string; size?: number | null }>`
  font-weight: bold;
  font-size: 24px;
  color: ${(props) => props.color};
  cursor: pointer;
  font-size: ${(props) => (props.size ? props.size : 'unset')}px;
`;

interface TypographyProps {
  children: string | JSX.Element | any;
  color?: string;
  size?: number | null;
  className?: string;
  onClick?: () => void;
}

const Typography = ({
  children,
  color = '#fff',
  onClick,
  size = null,
  className,
}: TypographyProps): JSX.Element => {
  return (
    <TypographyWrapper
      className={className}
      color={color}
      size={size}
      onClick={onClick}
    >
      {children}
    </TypographyWrapper>
  );
};

export default Typography;
