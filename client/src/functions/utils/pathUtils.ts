import { PathStructure } from "../../types/app/pathTypes";
import { toKebabCase } from "./dataStructureUtils/stringUtils";

export const createPathStructure = (
  path: PathStructure,
  relPath: string = "",
  absPath: string = "",
  param?: string
): PathStructure => {
  const updatedPath: PathStructure = {
    _abs: absPath,
    _rel: relPath,
    _param: param,
  };

  Object.entries(path)
    .filter(([key]) => !["_abs", "_rel", "_param"].includes(key)) // 無視するキーをフィルタリング
    .forEach(([key, value]) => {
      if (!isPathStructure(value)) {
        throw new Error("Nested values must be an object of PathStructure.");
      }

      const item = value as PathStructure;
      const newRelPath = `${toKebabCase(item._rel || key)}${item._param ? `/:${item._param}` : ""}`;
      updatedPath[key] = createPathStructure(item, newRelPath, `${absPath}/${newRelPath}`, item._param);
    });

  return updatedPath;
};

// PathStructure型かどうかを確認するガード関数
const isPathStructure = (value: any): value is PathStructure => {
  return typeof value === "object" && value !== null && "_abs" in value && "_rel" in value;
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

export const removeParam = (path: string): string => {
  return path.replace(/\/:[^/]+/g, '');  // `/:param` を削除
};

/**
 * パスのパラメータを置換する関数
 * @param path - パス文字列
 * @param params - パスのパラメータを置換するオブジェクト
 * @returns - 置換後のパス
 */
export const replaceParams = (path: string, params: Record<string, string>): string => {
  return path.replace(/:([a-zA-Z0-9_]+)/g, (match, key) => {
    // パラメータが存在すれば置換し、なければそのまま保持
    return key in params ? params[key] : match;
  });
};