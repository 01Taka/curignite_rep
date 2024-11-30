import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useDefaultNavigation = (defaultAbsPath: string, validAbsPaths: string[]) => {
  const { pathname } = useLocation(); // location.pathname だけを使う
  const navigate = useNavigate();

  useEffect(() => {
    const isValidPath = validAbsPaths.includes(pathname);
    
    if (!isValidPath && pathname !== defaultAbsPath) {
      navigate(defaultAbsPath, { replace: true });
    }
  }, [defaultAbsPath, validAbsPaths, pathname, navigate]);
};

export default useDefaultNavigation;
