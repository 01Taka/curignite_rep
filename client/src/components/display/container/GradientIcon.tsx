import React, { ReactNode } from 'react';
import { getValueBetween } from '../../../functions/objectUtils';
import { HexColorCode, StringNumber } from '../../../types/util/utilTypes';
import { AvatarVariant } from '../../../types/module/mui/muiTypes';
import { Variant } from '@mui/material/styles/createTypography';
import MiniIcon from './MiniIcon';

interface ComponentColor {
  textColor: HexColorCode;
  bgcolor: HexColorCode;
}

interface GradientIconProps<T extends string | number | StringNumber> {
  title?: string;
  children: ReactNode;
  colors: Record<T, HexColorCode | ComponentColor>;
  errorColor: HexColorCode;
  value: T;
  titleVariant?: Variant;
  avatarVariant?: AvatarVariant;
  useUpper?: boolean; // 上限か下限かを選択するオプション
}

const GradientIcon = <T extends string | number>({
  title,
  children,
  colors,
  errorColor,
  value,
  titleVariant = 'body2',
  avatarVariant,
  useUpper = false,
}: GradientIconProps<T>) => {
  const selectedColor = getValueBetween(colors, value, useUpper) || errorColor;
  return (
    <MiniIcon 
      title={title}
      children={children}
      color={selectedColor}
      titleVariant={titleVariant}
      avatarVariant={avatarVariant}
    />
  );
};

export default React.memo(GradientIcon);
