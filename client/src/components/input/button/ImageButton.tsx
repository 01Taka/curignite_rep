import React from 'react';
import { Typography } from '@mui/material';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../../functions/utils';

interface ImageButtonProps extends VariantProps<typeof imageButtonVariants> {
  label: string;
  src: string;
  alt: string;
  whiteText?: boolean;
  onClick?: () => void;
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // テキストサイズオプションを追加
}

// cva を使ってスタイルのバリエーションを定義
const imageButtonVariants = cva(
  'shadow-md hover:scale-105 transition-all duration-300', 
  {
    variants: {
      shape: {
        square: 'rounded-md',
        circle: 'rounded-full',
      },
      bgColor: {
        transparent: 'bg-transparent shadow-none hover:shadow-md',
        main: 'bg-main hover:bg-main-hover border-main hover:border-main-hover',
        primaryBase: 'bg-primaryBase hover:bg-primaryBase-hover border-primaryBase hover:border-primaryBase-hover',
        secondaryBase: 'bg-secondaryBase hover:bg-secondaryBase-hover border-secondaryBase hover:border-secondaryBase-hover',
      },
      size: {
        xs: 'w-16 h-16',
        sm: 'w-20 h-20',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
        xl: 'w-40 h-40',
      },

    },
    defaultVariants: {
      shape: 'square',
      bgColor: 'transparent',
      size: 'md',
    },
  }
);

const textVariants = cva(
  "",
  {
    variants: {
      textSize: { // テキストサイズのバリエーションを追加
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      }
    },
    defaultVariants: {
      textSize: "md"
    }
  }
)

const ImageButton: React.FC<ImageButtonProps> = ({
  label,
  src,
  alt,
  whiteText = false,
  onClick,
  shape,
  bgColor,
  size,
  textSize = 'md', // テキストサイズのデフォルト値を設定
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  return (
    <button 
      onClick={onClick} 
      className={cn(imageButtonVariants({ shape, bgColor, size }))}
    >
      <div className='flex flex-col justify-end items-center w-full h-full '>
        <img 
          src={src} 
          alt={alt} 
          onDragStart={handleDragStart} 
          className="w-4/5 h-auto my-auto" 
        />
        <Typography>
          <div className={cn("w-full mt-1", whiteText ? 'text-white' : 'text-black', textVariants({ textSize }))}>
            {label}
          </div>
        </Typography>
      </div>
    </button>
  );
};

export default ImageButton;
