import { cn } from "../../../functions/utils";
import { SideListProps } from "../navigationTypes";
  
const SideList: React.FC<SideListProps> = ({ children, width = "w-80" }) => {
    return (
      <div className={cn("bg-gray-100 z-10", width)}>
        {children}
      </div>
    );
};
  
export default SideList