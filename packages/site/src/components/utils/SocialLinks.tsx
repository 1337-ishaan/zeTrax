import styled from 'styled-components/macro';
import FlexRowWrapper from './wrappers/FlexRowWrapper';
import { ReactComponent as XLogo } from '../../assets/x.svg';
import { ReactComponent as TelegramLogo } from '../../assets/telegram.svg';
import { ReactComponent as YoutubeLogo } from '../../assets/youtube.svg';
import { ReactComponent as GitbookLogo } from '../../assets/gitbook.svg';

const SocialLinksWrapper = styled(FlexRowWrapper)`
  column-gap: 24px;

  a.social {
    background: ${(props) => props.theme.colors?.background?.inverse};
    align-items: center;
    display: flex;
    padding: 12px 12px;
    border-radius: ${(props) => props.theme.borderRadius};
    column-gap: 4px;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
      transition: all 0.3s;
    }
    .social-logo {
      max-width: 32px;
      max-height: 32px;
    }
  }
`;

interface SocialLinksProps {}

const SocialLinks = ({}: SocialLinksProps): JSX.Element => {
  return (
    <SocialLinksWrapper>
      <a className="social" rel="noopener noreferrer" href="https://www.youtube.com/@ZetaMask">
        <YoutubeLogo className="social-logo" />
      </a>
      <a className="social" rel="noopener noreferrer" href="https://x.com/zetamask">
        <XLogo className="social-logo" />
      </a>
      <a className="social" rel="noopener noreferrer" href="https://t.me/zetamask">
        <TelegramLogo className="social-logo" />
      </a>
      <a
        className="social"
        rel="noopener noreferrer"
        href="https://etherates-organization.gitbook.io/zetamask"
      >
        <GitbookLogo className="social-logo" />
      </a>
    </SocialLinksWrapper>
  );
};

export default SocialLinks;
