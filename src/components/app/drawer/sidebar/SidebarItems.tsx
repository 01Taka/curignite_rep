import { Divider } from "@mui/material";
import { SidebarElement } from "../../../../types/app/main";
import SidebarItem from "./SidebarItem";

interface SidebarItemsProps {
    open: boolean;
    itemsSet: SidebarElement[][];
  }
  
const SidebarItems: React.FC<SidebarItemsProps> = ({ open, itemsSet }) => (
    <div>
        {itemsSet.map((items, itemsIndex) => (
        <div key={itemsIndex}>
            {items.map((item, index) => (
            <SidebarItem key={`${itemsIndex}.${index}`} item={item} open={open} />
            ))}
            {itemsIndex !== itemsSet.length - 1 && <Divider />}
        </div>
        ))}
    </div>
);

export default SidebarItems