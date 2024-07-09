import { useLocation, useNavigate } from "react-router-dom";
import { SidebarElement } from "../../../../types/app/main";
import { Button } from "@mui/material";

interface SidebarItemProps {
  item: SidebarElement;
  open: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const buttonVariant = location.pathname === `/home/${item.path}` ? 'outlined' : 'text';

  return (
    <div className='flex justify-start items-center'>
      <Button
        startIcon={item.icon}
        onClick={() => handleNavigate(item.path)}
        size="large"
        fullWidth
        variant={buttonVariant}
      >
        <div className="h-12"/>
        {open && <div className="flex items-center transition-all duration-300">{item.name}</div>}
      </Button>
    </div>
  );
};

export default SidebarItem;
