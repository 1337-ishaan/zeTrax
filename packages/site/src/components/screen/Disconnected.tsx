import styled from 'styled-components/macro';
import Typography from '../utils/Typography';
import FlexColumnWrapper from '../utils/wrappers/FlexColumnWrapper';
import FlexRowWrapper from '../utils/wrappers/FlexWrapper';
import SocialLinks from '../utils/SocialLinks';

const DisconnectedWrapper = styled(FlexRowWrapper)`
  min-height: 80vh;
  width: 80vw;
  margin-top: 88px;
  column-gap: 44px;
  .supported-resources {
    width: 50%;
    row-gap: 40px;
  }
`;

interface DisconnectedProps {}

const Disconnected = ({}: DisconnectedProps): JSX.Element => {
  return (
    <DisconnectedWrapper>
      <FlexColumnWrapper className="supported-resources">
        <Typography size={24} weight={300}>
          Welcome to ZeSnap 🎉
          <br />
          <br /> The only ZetaChain Metamask Snap allowing you to bridge native
          BTC to supported ZRC20 asset.
          <br />
          <br />
          <br />
          Learn more about ZeSnap ↓
        </Typography>
        <SocialLinks />
      </FlexColumnWrapper>
      <iframe
        width="560"
        height="400"
        src="https://www.youtube.com/embed/_HDjDUDkdnQ?si=VYmO7DbJIBbjYtpK"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; 22gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </DisconnectedWrapper>
  );
};

export default Disconnected;
