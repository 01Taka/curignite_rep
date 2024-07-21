import { TopBarProps } from "../navigationTypes";
import { cn } from "../../../functions/utils";

const TopBar: React.FC<TopBarProps> = ({ children, height = "h-16" }) => {
  return (
    <div className={cn("w-full bg-main", height)}>
      {children}
    </div>
  );
};

export default TopBar