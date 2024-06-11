import { Divider, IconButton } from "@mui/material";
import classNames from "classnames";
import SidebarItems from "./SidebarItems";
import { SidebarElement } from "../../../../types/app/home";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Sidebar component
interface SidebarProps {
  elements: SidebarElement[][]
  open: boolean;
  handleToggleOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ elements, open, handleToggleOpen }) => (
  <div
    className={classNames(
      'flex-shrink-0 whitespace-nowrap box-border transition-all duration-300',
      {
        'w-64': open,
        'w-16': !open,
      },
      'fixed top-0 left-0',
    )}
  >
    <div className="flex justify-end items-center px-2 sm:h-16 h-14">
      <IconButton onClick={handleToggleOpen}>
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </div>
    <Divider />
    <SidebarItems itemsSet={elements} open={open} />
  </div>
);

export default Sidebar