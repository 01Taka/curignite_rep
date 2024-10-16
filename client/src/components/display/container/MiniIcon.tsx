import React, { ReactNode } from 'react';
import { HexColorCode } from '../../../types/util/utilTypes';
import { Avatar, Box } from '@mui/material';
import { chooseTextColor } from '../../../functions/colorUtils';
import { AvatarVariant } from '../../../types/module/mui/muiTypes';
import HideEmptyTypography from '../wrap/HideEmptyTypography';
import { Variant } from '@mui/material/styles/createTypography';

interface ComponentColor {
  textColor: HexColorCode;
  bgcolor: HexColorCode;
}

interface MiniIconProps {
  title?: string;
  children: ReactNode;
  color: HexColorCode | ComponentColor;
  titleVariant?: Variant;
  avatarVariant?: AvatarVariant;
}

const MiniIcon: React.FC<MiniIconProps> = ({
  title,
  children,
  color,
  titleVariant = 'body2',
  avatarVariant,
}) => {
  const isComponentColor = (color: any): color is ComponentColor => typeof color === 'object' && 'bgcolor' in color;
  const backgroundColor = isComponentColor(color) ? color.bgcolor : color;
  const textColor = isComponentColor(color) ? color.textColor : chooseTextColor(color);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {title && (
        <HideEmptyTypography variant={titleVariant}>
          {title}
        </HideEmptyTypography>
      )}
      <Avatar
        variant={avatarVariant}
        sx={{
          bgcolor: backgroundColor,
          color: textColor,
        }}
      >
        {children}
      </Avatar>
    </Box>
  );
};

export default React.memo(MiniIcon);
