import styled from 'styled-components';

const StyledButtonWrapper = styled.button`
  border: none;
  border-radius: ${(props) => props.theme.borderRadius};
  background: ${(props) => props.theme.colors.dark};
  transition: all 0.3s;

  &:hover {
    background: #fff;
    transform: scale(1.1);
    transition: all 0.3s;
  }
`;

const StyledButton = ({ ...props }): JSX.Element => {
  return <StyledButtonWrapper {...props}>{props.children}</StyledButtonWrapper>;
};

export default StyledButton;
