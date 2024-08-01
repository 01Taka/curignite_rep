import { FC } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../../functions/utils';
import { millisToTime } from '../../../functions/dateTimeUtils';
import { DecimalDigits } from '../../../types/util/componentsTypes';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// タイマーのスタイルのバリエーションを定義
const timerVariants = cva("flex justify-center items-center rounded-full text-black", {
  variants: {
    size: {
      sm: 'w-12 h-12 text-sm',
      md: 'w-20 h-20 text-md',
      lg: 'w-24 h-24 text-lg',
      xl: 'w-32 h-32 text-2xl',
    },
    bgColor: {
      main: 'bg-main text-white',
      primaryBase: 'bg-primaryBase',
      secondaryBase: 'bg-secondaryBase',
      accent: 'bg-accent',
    },
    textColor: {
      black: 'text-black',
      white: 'text-white',
      gray: 'text-gray-400',
      auto: '',
    },
  },
  defaultVariants: {
    size: 'md',
    bgColor: 'main',
    textColor: 'auto',
  }
});

// ボタンのサイズのバリエーションを定義
const buttonSizeVariants = cva("", {
  variants: {
    size: {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-14 h-14',
    },
  },
  defaultVariants: {
    size: 'md',
  }
});

// TimerProps インターフェースを定義
interface TimerProps extends VariantProps<typeof timerVariants> {
  time: number;
  active: boolean;
  text?: string;
  decimalDigits?: DecimalDigits;
  flexMin?: boolean;
  className?: string;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const Timer: FC<TimerProps> = ({ time, active, text = "", size, bgColor, textColor, decimalDigits = 0, flexMin = false, className = "", onStart, onStop, onReset }) => {
  const timerClass = cn(timerVariants({ size, bgColor, textColor }), className);
  const buttonSize = buttonSizeVariants({ size });

  const handleClick = () => {
    if (active) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex items-start">
      <div className={timerClass}>
        <div className='flex flex-col justify-center items-center'>
          <div>{millisToTime(time, decimalDigits, flexMin)}</div>
          <div className="text-xl">{text}</div>
        </div>
      </div>
      <div className="flex items-center">
        <button className={cn("bg-main rounded-full flex justify-center items-center", buttonSize)} onClick={handleClick}>
          {active ? <StopIcon /> : <PlayArrowIcon />}
        </button>
        <button className={cn("ml-1 bg-main rounded-full flex justify-center items-center transform duration-100", buttonSize, active ? "opacity-0 scale-0" : "opacity-100 scale-100")} onClick={onReset}>
          <RestartAltIcon />
        </button>
      </div>
    </div>
  );
}

export default Timer;
