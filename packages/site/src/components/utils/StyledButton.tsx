import styled from 'styled-components';

const StyledButtonWrapper = styled.button`
  border: none;
  border-radius: ${(props) => props.theme.borderRadius};
  background: ${(props) => props.theme.colors.dark};
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    cursor: pointer;
    background: #fff;
    transform: scale(1.1);
    transition: all 0.3s;
  }
  &:disabled {
    transform: unset;
    background: #898989;
    &:hover {
      background: #898989;
    }
  }
`;

const StyledButton = ({ ...props }): JSX.Element => {
  return <StyledButtonWrapper {...props}>{props.children}</StyledButtonWrapper>;
};

export default StyledButton;
