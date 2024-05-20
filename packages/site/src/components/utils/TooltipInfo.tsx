import 'rc-tooltip/assets/bootstrap_white.css';
import styled from 'styled-components/macro';

import Tooltip from 'rc-tooltip';
import React from 'react';
import { ReactComponent as InfoIcon } from '../../assets/info.svg';
import FlexRowWrapper from './wrappers/FlexWrapper';

const TooltipInfoWrapper = styled(Tooltip)`
  width: fit-content;
`;

interface TooltipInfoProps {
  children: React.ReactNode;
  placement?: string;
}

const TooltipInfo = ({
  children,
  placement = 'top',
}: TooltipInfoProps): JSX.Element => {
  return (
    <TooltipInfoWrapper
      //   visible
      showArrow={false}
      placement={placement}
      overlayInnerStyle={{
        background: '#008462',
        border: 'none',
        color: '#fff',
      }}
      overlay={<span>{children}</span>}
    >
      <FlexRowWrapper>
        <InfoIcon height={24} width={24} color="#ffffff" />
      </FlexRowWrapper>
    </TooltipInfoWrapper>
  );
};

export default TooltipInfo;
