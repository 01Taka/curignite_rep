import { toKebabCase } from "../../functions/utils/stringUtils";
import { PathStructure } from "../../types/app/pathTypes";

export const createPathStructure = (path: PathStructure, relPath: string = "", absPath: string = ""): PathStructure => {
  const updatedPath: PathStructure = {
    _abs: absPath,
    _rel: relPath,
  };

  Object.entries(path)
    .filter(([key]) => !["_abs", "_rel"].includes(key))
    .forEach(([key, value]) => {
      if (typeof value !== "object" || value === null) {
        throw new Error("Nested values must be an object of PathStructure.");
      }
      const item = typeof path[key] === "object" ? path[key] as PathStructure : null;
      const relPath = toKebabCase((!!item && item._rel) || key);
      updatedPath[key] = createPathStructure(value, relPath, `${absPath}/${relPath}`);
    });

  return updatedPath;
};

export const getPathList = (
  path: PathStructure,
  options?: Partial<{ type: "_abs" | "_rel"; includeRoot: boolean }> // デフォルトは絶対パス、ルートを含む
): string[] => {
  const pathType = options?.type ?? "_abs"; // "_abs" または "_rel"
  const includeRoot = options?.includeRoot ?? true;

  if (!["_abs", "_rel"].includes(pathType)) {
    throw new Error(`Invalid path type specified: ${pathType}`);
  }

  const collectPaths = (currentPath: PathStructure, paths: string[] = []): string[] => {
    // 現在のパスをリストに追加
    paths.push(currentPath[pathType] as string);

    // 子パスを再帰的に処理
    Object.entries(currentPath).forEach(([key, value]) => {
      if (key !== "_abs" && key !== "_rel" && typeof value === "object" && value !== null) {
        collectPaths(value as PathStructure, paths);
      }
    });

    return paths;
  };

  const paths = collectPaths(path);
  return includeRoot ? paths : paths.filter(item => item !== path[pathType]);
};
