import { VariantProps, cva } from 'class-variance-authority';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { cn, isMobileMode } from '../../../functions/utils';

// CircularButtonProps インターフェースを定義
const size = {
    xs: 'w-9 h-9 text-xs border-2',
    sm: 'w-12 h-12 text-xs border-2',
    md: 'w-16 h-16 text-sm border-4',
    lg: 'w-20 h-20 text-md border-4',
    xl: 'w-24 h-24 text-xl border-4',
    x4l: 'w-32 h-32 text-2xl border-4',
    x8l: 'w-48 h-48 text-4xl border-8',
}

interface CircularButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof circularButtonVariants> {
    children: ReactNode;
    invalidation?: boolean;
    mobileSize?: keyof typeof size;
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
)

// CircularButton コンポーネントを定義
const CircularButton: FC<CircularButtonProps> = ({ children, className, bgColor, size, mobileSize, textColor, looks, invalidation, ...props }) => {
    const applySize = mobileSize ? (isMobileMode() ? mobileSize : size) : size;
    const buttonClass = cn(circularButtonVariants({ bgColor, size: applySize, looks, textColor }), className, {
        'bg-gray-400 hover:bg-gray-400 hover:scale-100': invalidation,
    });

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
