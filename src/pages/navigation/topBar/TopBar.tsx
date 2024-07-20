import { AppBar, Toolbar } from "@mui/material";
import { TopBarProps } from "../navigationTypes";
import { cn } from "../../../functions/utils";

const TopBar: React.FC<TopBarProps> = ({ children, height = "h-16" }) => {
  return (
    <AppBar position="static" className={cn(height)}>
      <Toolbar>
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar