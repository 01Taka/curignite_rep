import React, { ReactNode } from 'react';
import { getValueBetween } from '../../../functions/objectUtils';
import { HexColorCode } from '../../../types/util/utilTypes';
import { Avatar, Box } from '@mui/material';
import { chooseTextColor } from '../../../functions/colorUtils';
import { AvatarVariant } from '../../../types/module/mui/muiTypes';
import HideEmptyTypography from '../wrap/HideEmptyTypography';

interface ComponentColor {
  textColor: HexColorCode;
  bgcolor: HexColorCode;
}

interface GradientIconProps<T extends string | number> {
  title?: string;
  variant?: AvatarVariant;
  children: ReactNode;
  colors: Record<T, HexColorCode | ComponentColor>;
  errorColor: HexColorCode;
  value: T;
  useUpper?: boolean; // 上限か下限かを選択するオプション
}

const GradientIcon = <T extends string | number>({
  title,
  variant,
  children,
  colors,
  errorColor,
  value,
  useUpper = false,
}: GradientIconProps<T>) => {
  const selectedColor = getValueBetween(colors, value, useUpper) || errorColor;
  const isComponentColor = (color: any): color is ComponentColor => typeof color === 'object' && 'bgcolor' in color;

  const backgroundColor = isComponentColor(selectedColor) ? selectedColor.bgcolor : selectedColor;
  const textColor = isComponentColor(selectedColor) ? selectedColor.textColor : chooseTextColor(selectedColor);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {title && (
        <HideEmptyTypography variant="body2">
          {title}
        </HideEmptyTypography>
      )}
      <Avatar
        variant={variant}
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

export default React.memo(GradientIcon);
