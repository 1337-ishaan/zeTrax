import styled from 'styled-components';

const StyledButtonWrapper = styled.button`
  border: none;
  border-radius: ${(props) => props.theme.borderRadius};
  background: ${(props) => props.theme.colors};

  &:hover {
  }
`;

const StyledButton = ({ ...props }): JSX.Element => {
  return <StyledButtonWrapper {...props}>{props.children}</StyledButtonWrapper>;
};

export default StyledButton;
