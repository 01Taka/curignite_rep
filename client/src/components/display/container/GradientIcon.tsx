import React, { ReactNode } from 'react';
import { HexColorCode, StringNumber } from '../../../types/util/utilTypes';
import { AvatarVariant } from '../../../types/module/mui/muiTypes';
import { Variant } from '@mui/material/styles/createTypography';
import MiniIcon from './MiniIcon';
import { performComparison } from '../../../functions/utils/utils';

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

/**
 * 与えられた `valueMap` から、指定された `value` に最も近いキーに対応する値を返します。
 * `useUpper` によって、2つのキーの間で上限（大きい方）か下限（小さい方）のどちらの値を使用するかを決定します。
 * 
 * @template T - `valueMap` のキーの型。`string` または `number` が利用できます。
 * @template K - `valueMap` の値の型。
 * 
 * @param valueMap - キーと値のマップ。キーは `string` または `number` で、値は任意の型です。
 * @param value - 検索対象のキー。`valueMap` のキーの型と同じ型である必要があります。
 * @param useUpper - true の場合、`value` より大きい最も近いキーの値を返し、false の場合は `value` 以下の最も近いキーの値を返します。
 * @returns `value` に最も近いキーに対応する `valueMap` の値を返します。
 */
export const getValueBetween = <T extends number | string | StringNumber, K>(
  valueMap: Record<T, K>, 
  value: T, 
  useUpper: boolean = false
): K | null=> {
  let closestKey: T | null = null;
  for (const key of Object.keys(valueMap) as T[]) {
    if (useUpper) {
      if (performComparison(key, value, ">=") && (closestKey === null || performComparison(key, closestKey, "<"))) {  
        closestKey = key;
      }
    } else {
      if (performComparison(key, value, "<=") && (closestKey === null || performComparison(key, closestKey, ">"))) {
        closestKey = key;
      }
    }
  }

  if (closestKey === null) {
    console.error('No suitable key found in valueMap.');
    return null;
  }

  return valueMap[closestKey];
};

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
