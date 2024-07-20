import { BottomBarProps } from "../navigationTypes";
import { cn } from "../../../functions/utils";

const BottomBar: React.FC<BottomBarProps> = ({ children, height = "h-16" }) => {
  return (
    <div className={cn("w-full", height)}>
      {children}
    </div>
  );
};

export default BottomBar