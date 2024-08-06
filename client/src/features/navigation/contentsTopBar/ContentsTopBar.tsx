import { ContentsTopBarProps } from "../../../types/app/navigationTypes";
import { cn } from "../../../functions/utils";
import { useEffect, useState } from "react";

const ContentsTopBar: React.FC<ContentsTopBarProps> = ({ children, height = "h-16", bgTransparent = true }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  if (!showNavbar) {
    return null;
  }
  
  return (
    <div className={cn("fixed right-0 w-full bg-main", height, bgTransparent && "bg-transparent")}>
      {children}
    </div>
  );
};

export default ContentsTopBar