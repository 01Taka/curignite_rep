import { FC } from "react";
import { HexColorCode } from "../../../types/util/utilTypes";
import { cn } from "../../../functions/utils";

interface TagProps {
  label: string;
  color: HexColorCode;
  index: number;
  currentIndex: number | null;
  hidden: boolean;
  setIndex: (index: number) => void;
}

const Tag: FC<TagProps> = ({ label, color, index, currentIndex, hidden, setIndex }) => {
  const handleSetIndex = () => {
    if (index !== currentIndex) {
      setIndex(index);
    }
  }

  if (hidden) return null;

  return (
    <div
      className={cn('flex justify-end items-center rounded-r-lg w-14 h-7 hover:w-16 hover:cursor-pointer transition-all duration-200 my-2 pr-2', index === currentIndex && 'w-20 hover:w-20 scale-y-110')}
      style={{ backgroundColor: color }}
      onClick={handleSetIndex}
    >
      {label}
    </div>
  );
}

export default Tag;