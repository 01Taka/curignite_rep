import { ClickAwayListener, Tooltip } from '@mui/material';
import React from 'react';
import useToggle from '../../../features/hooks/useToggle';

interface MobileTooltipProps {
  title: string;
  buttonText: string;
}

const MobileTooltip: React.FC<MobileTooltipProps> = ({ title, buttonText }) => {
  const { open, toOpen, toClose } = useToggle();
  return (
    <ClickAwayListener onClickAway={toClose}>
      <div>
        <Tooltip
          onClose={toClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={title}
          slotProps={{
            popper: {
              disablePortal: true,
            },
          }}
        >
          <button onClick={toOpen}>{buttonText}</button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default MobileTooltip;