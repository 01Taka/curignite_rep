import { ContentsBottomBarProps } from "../navigationTypes";
import { cn } from "../../../functions/utils";

const ContentsBottomBar: React.FC<ContentsBottomBarProps> = ({ children, height = "h-16" }) => {
  return (
    <div className={cn("fixed bottom-0 w-full", height)}>
      {children}
    </div>
  );
};

export default ContentsBottomBar