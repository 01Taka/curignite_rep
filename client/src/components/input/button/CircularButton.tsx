import { VariantProps, cva } from 'class-variance-authority';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { cn } from '../../../functions/utils';
import { useAppSelector } from '../../../redux/hooks';

// CircularButtonProps インターフェースを定義
const size = {
    xs: 'w-9 h-9 border-2',
    sm: 'w-12 h-12 border-2',
    md: 'w-16 h-16 border-2',
    lg: 'w-20 h-20 border-2',
    xl: 'w-24 h-24 border-4',
    x4l: 'w-32 h-32 border-4',
    x8l: 'w-48 h-48 border-8',
};

const textSize = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-md',
    xl: 'text-xl',
    x4l: 'text-2xl',
    x8l: 'text-4xl',
};

export type CircularButtonSize = keyof typeof size;
export type CircularButtonTextSize = keyof typeof textSize;

interface CircularButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof circularButtonVariants> {
    children: ReactNode;
    invalidation?: boolean;
    mobileSize?: CircularButtonSize;
    textSize?: CircularButtonTextSize; // New prop for text size
}

// class-variance-authority を使ってスタイルのバリエーションを定義
const circularButtonVariants = cva("rounded-full flex items-center justify-center flex-shrink-0 text-black border transition-all duration-300 hover:scale-110", 
    {
        variants: {
            bgColor: {
                main: 'bg-main hover:bg-main-hover border-main hover:border-main-hover text-white',
                primaryBase: 'bg-primaryBase hover:bg-primaryBase-hover border-primaryBase hover:border-primaryBase-hover',
                secondaryBase: 'bg-secondaryBase hover:bg-secondaryBase-hover border-secondaryBase hover:border-secondaryBase-hover',
                accent: 'bg-accent hover:bg-accent-hover border-accent hover:border-accent-hover',
                success: 'bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 text-white', // 完了用の緑
                danger: 'bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white', // 破壊的操作用の赤
            },            
            size: size,
            looks: {
                fill: 'border-none',
                frame: 'bg-transparent text-black hover:bg-transparent',
                transparent: 'bg-transparent text-black',
            },
            textColor: {
                black: 'text-black',
                white: 'text-white',
                gray: 'text-gray-400',
                auto: '',
            },
        },
        defaultVariants: {
            bgColor: 'secondaryBase',
            size: 'md',
            looks: 'fill',
            textColor: 'auto',
        }
    }
);

// CircularButton コンポーネントを定義
const CircularButton: FC<CircularButtonProps> = ({ children, className, bgColor, size, mobileSize, textSize: customTextSize, textColor, looks, invalidation, ...props }) => {
    const { device } = useAppSelector(state => state.userSlice);
    
    const applySize = (mobileSize ? (device === "mobile" ? mobileSize : size) : size) || "md";
    const applyTextSize = customTextSize ? textSize[customTextSize] : textSize[applySize];
    
    const buttonClass = cn(
        circularButtonVariants({ bgColor, size: applySize, looks, textColor }), 
        applyTextSize, // Apply the determined text size
        className, 
        {
            'bg-gray-400 hover:bg-gray-400 hover:scale-100': invalidation,
        }
    );

    return (
        <button 
            className={buttonClass}
            disabled={invalidation}
            {...props}
        >
            {children}
        </button>
    );
}

export default CircularButton;
