import { createPathStructure } from "../../../functions/utils/pathUtils";
import { PathStructure } from "../../../types/app/pathTypes";

const createPath = (options?: Partial<{ rel: string, param: string }>): PathStructure => ({
  _abs: "",
  _rel: options?.rel ?? "",
  _param: options?.param
});

const appPathStructure = {
  ...createPath(),
  task: {
    ...createPath(),
    list: createPath(),
    problemSets: createPath()
  },
};


export const appPaths = createPathStructure(appPathStructure, "app", "/app") as typeof appPathStructure;
