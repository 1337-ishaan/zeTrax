import styled from 'styled-components';

const StyledButtonWrapper = styled.button`
  border: none;
`;

const StyledButton = ({ ...props }): JSX.Element => {
  return <StyledButtonWrapper {...props}>{props.children}</StyledButtonWrapper>;
};

export default StyledButton;
