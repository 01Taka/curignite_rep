import { useState } from "react";
import { SidebarElement } from "../../../types/app/main";
import Sidebar from "./sidebar/Sidebar";
import TopDrawer from "./TopDrawer";

// SidebarContainerView component
interface DrawerViewProps {
  elements: SidebarElement[][]
  children: React.ReactNode;
}

const DrawerView: React.FC<DrawerViewProps> = ({ elements, children }) => {
  const [open, setOpen] = useState(false);

  const handleToggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="flex">
      <Sidebar elements={elements} open={open} handleToggleOpen={handleToggleOpen} />
      <TopDrawer
        startItems={['Curignite', 'H']}
        endItems={['Curignite', 'G']}
      />
      <div className={`mt-16 ${open ? 'pl-64' : 'pl-16'} w-full transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
};

export default DrawerView;
