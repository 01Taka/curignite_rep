import { PathStructure } from "./pathTypes";

export const setPath = (path: PathStructure, relPath: string = "", absPath: string = ""): PathStructure => {
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
      updatedPath[key] = setPath(value, key, `${absPath}/${key}`);
    });

  return updatedPath;
};