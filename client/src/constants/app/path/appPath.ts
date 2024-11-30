import { createPathStructure } from "../../../functions/utils/pathUtils";
import { PathStructure } from "../../../types/app/pathTypes";

const createPath = (rel: string = ""): PathStructure => ({
  _abs: "",
  _rel: rel,
});

const appPathStructure = {
  ...createPath(),
  task: {
    ...createPath(),
    list: {
      ...createPath(),
      taskDetail: createPath(),
    },
    problemSets: {
      ...createPath(),
      problemSetDetail: createPath(),
    },
  },
};


export const appPaths = createPathStructure(appPathStructure, "app", "/app") as typeof appPathStructure;
