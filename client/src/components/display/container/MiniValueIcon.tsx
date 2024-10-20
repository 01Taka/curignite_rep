import React, { ReactNode, useState } from 'react';
import { IconProp } from '../../../types/util/componentsTypes';
import { AvatarProps, Box, Typography, Tooltip } from '@mui/material';
import IconDisplay from '../picture/IconDisplay';
import { AvatarVariant } from '../../../types/module/mui/muiTypes';
import { Variant } from '@mui/material/styles/createTypography';

interface MiniValueIconProps {
  icon: IconProp;
  value: string | number | ReactNode;
  size?: number;
  valueVariant?: Variant;
  avatarProps?: AvatarProps;
  avatarVariant?: AvatarVariant;
  tooltipText?: string; // ホバー時に表示する説明テキスト（オプション）
  hide?: boolean;
}

const MiniValueIcon: React.FC<MiniValueIconProps> = ({
  icon,
  value,
  size = 20,
  valueVariant,
  avatarProps,
  avatarVariant,
  tooltipText,
  hide = false
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false); // ツールチップの表示状態を管理するためのステート

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  if (hide) {
    return null;
  }

  const content = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        cursor: tooltipText ? 'pointer' : 'default', // tooltipTextがあればポインタを変更
      }}
      onClick={tooltipText ? handleTooltipOpen : undefined} // クリック時にツールチップを開く
    >
      <IconDisplay icon={icon} size={size} avatarProps={avatarProps} avatarVariant={avatarVariant} />
      <Typography sx={{ marginLeft: 0.1 }} variant={valueVariant}>
        {value}
      </Typography>
    </Box>
  );

  return tooltipText ? (
    <Tooltip title={tooltipText} open={tooltipOpen} onClose={handleTooltipClose} disableInteractive>
      <Box sx={{ display: 'inline-flex' }}>
        {content}
      </Box>
    </Tooltip>
  ) : (
    content
  );
};

export default MiniValueIcon;
