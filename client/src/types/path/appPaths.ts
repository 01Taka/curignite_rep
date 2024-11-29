import { PathStructure } from "./pathTypes";
import { setPath } from "./utils";

const emptyPath = (): PathStructure => ({
  _abs: "",
  _rel: "",
});

const appPathStructure = {
  ...emptyPath(),
  task: {
    ...emptyPath(),
    list: emptyPath(),
    problemSets: emptyPath(),
    create: emptyPath(),
    detail: emptyPath(),
  },
};


export const appPaths = setPath(appPathStructure, "app", "/app") as typeof appPathStructure;
