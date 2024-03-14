import styled from 'styled-components';

const StyledInputWrapper = styled.input`
  border: none;
  padding: 16px;
  border-radius: 12px;
  &:focus {
    outline: none;
  }
`;

const StyledInput = ({ ...props }): JSX.Element => {
  return <StyledInputWrapper {...props} />;
};

export default StyledInput;
