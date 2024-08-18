import React, { FC, ReactNode } from 'react';
import { ComponentColor } from '../../../types/module/tailwindTypes';
import { cn } from '../../../functions/utils';
import { getValueBetween } from '../../../functions/objectUtils';
import { StringNumber } from '../../../types/util/utilTypes';
import { cva } from 'class-variance-authority';
import { GradientCircleSize } from '../../../types/app/task/taskTypes';

interface GradientCircleProps<T extends string | number | StringNumber> {
  title?: string;
  children: ReactNode;
  colors: Record<T, ComponentColor>;
  errorColor?: ComponentColor;
  value: T;
  useUpper?: boolean; // 上限か下限かを選択するオプション
  size?: GradientCircleSize; // サイズオプション
}

const gradientCircleStyles = cva(
  'flex flex-col justify-center items-center text-center rounded-full', {
    variants: {
      size: {
        sm: 'w-10 h-10 text-sm',
        md: 'w-20 h-20',
        lg: 'w-24 h-24',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const GradientCircle: FC<GradientCircleProps<string | number | StringNumber>> = ({ 
  title, 
  children, 
  colors, 
  errorColor = { bgColor: "bg-gray-500", textColor: "text-white" }, 
  value, 
  useUpper = false, 
  size = 'md' 
}) => {
  const selectedColor = getValueBetween(colors, value, useUpper) || errorColor;

  return (
    <div className='flex flex-col justify-center items-center'>
      {title && <span>{title}</span>}
      <div className={cn(gradientCircleStyles({ size }), selectedColor.borderColor && `border-4 ${selectedColor.borderColor}`, selectedColor.bgColor, selectedColor.textColor)}>
        {children}
      </div>
    </div>
  );
}

export default GradientCircle;
