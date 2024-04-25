import styled from 'styled-components/macro';
import { ReactComponent as InfoIcon } from '../../assets/info.svg';

const InfoBoxWrapper = styled.div`
  padding: 8px;
  background: rgba(255, 255, 0, 0.3);
  border-radius: ${(props) => props.theme.borderRadius};

  display: flex;
  align-items: center;
  column-gap: 8px;
  font-size: 14px;
  .info-icon {
    max-width: 24px;
    max-height: 24px;
  }
`;

interface InfoBoxProps {
  children: any;
}

const InfoBox = ({ children }: InfoBoxProps): JSX.Element => {
  return (
    <InfoBoxWrapper>
      <InfoIcon className="info-icon" />
      {children}
    </InfoBoxWrapper>
  );
};

export default InfoBox;
