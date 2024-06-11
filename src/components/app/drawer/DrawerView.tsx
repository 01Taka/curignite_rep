import { useState } from "react";
import { SidebarElement } from "../../../types/app/home";
import Sidebar from "./sidebar/Sidebar";
import TopDrawer from "./TopDrawer";

// SidebarContainerView component
interface DrawerViewProps {
  elements: SidebarElement[][]
  children: React.ReactNode;
}

const DrawerView: React.FC<DrawerViewProps> = ({ elements, children }) => {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleToggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="flex">
      <Sidebar elements={elements} open={open} handleToggleOpen={handleToggleOpen} />
      <TopDrawer
        items={'Curignite'}
        open={open}
        handleDrawerOpen={handleDrawerOpen}
      />
      <div className={`mt-16 ${open ? 'pl-64' : 'pl-16'} w-full transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
};

export default DrawerView;
