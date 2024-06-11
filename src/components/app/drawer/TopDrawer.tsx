import { IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import classNames from "classnames";
import { ReactNode } from "react";

interface TopDrawerProps {
    items?: ReactNode;
    open: boolean;
    handleDrawerOpen: () => void;
  }
  
  const TopDrawer: React.FC<TopDrawerProps> = ({ open, handleDrawerOpen, items }) => (
    <div
      className={classNames(
        'fixed top-0 left-0 w-full transition-all duration-300',
        {
          'ml-64 w-[calc(100%-256px)]': open, // 16rem = 240px
          'w-full': !open,
        },
        'bg-blue-500 z-50' // Ensure z-index is high enough
      )}
    >
      <Toolbar className="flex justify-between">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={classNames('transition-all duration-300', { hidden: open })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" className="text-white">
          {items}
        </Typography>
      </Toolbar>
    </div>
);

export default TopDrawer
  

