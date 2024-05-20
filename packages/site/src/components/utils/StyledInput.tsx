import styled from 'styled-components';

const StyledInputWrapper = styled.input`
  border: none;
  padding: 16px;
  /* width: 100%; */
  border-radius: ${(props) => props.theme.borderRadius};

  &:focus {
    outline: none;
  }
`;

const StyledInput = ({ ...props }): JSX.Element => {
  return <StyledInputWrapper {...props} />;
};

export default StyledInput;
