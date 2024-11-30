import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { matchPath } from "react-router-dom"; // React Router の組み込み matchPath を使用

const useDefaultNavigation = (defaultAbsPath: string, validAbsPaths: string[]) => {
  const { pathname } = useLocation(); // location.pathname だけを使う
  const navigate = useNavigate();

  useEffect(() => {
    // パスが有効かどうかを判定する関数
    const isValidPath = validAbsPaths.some((validPath) =>
      matchPath({ path: validPath, end: true }, pathname)
    );

    // 無効なパスならデフォルトのパスにリダイレクト
    if (!isValidPath && pathname !== defaultAbsPath) {
      navigate(defaultAbsPath, { replace: true });
    }
  }, [defaultAbsPath, validAbsPaths, pathname, navigate]);
};

export default useDefaultNavigation;
