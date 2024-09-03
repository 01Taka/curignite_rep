import { ReactNode } from "react";
import { taskPaths } from "../../../../types/path/mainPaths";
import CreateIndividualTask from "./createForm/CreateIndividualTask";
import CreateBatchTask from "./createForm/CreateCollectionTask";
import CreateTaskCollection from "./createForm/CreateTaskCollection";

interface ButtonConfig {
  label: ReactNode;
  path: string;
  content: ReactNode;
}

export const buttonConfigs: ButtonConfig[] = [
  {
    label: <>タスク<br/>を追加</>,
    path: taskPaths.createChildren.individual,
    content: <CreateIndividualTask />,
  },
  {
    label: <>ページ<br/>を追加</>,
    path: taskPaths.createChildren.batch,
    content: <CreateBatchTask />,
  },
  {
    label: <>問題集<br/>を作成</>,
    path: taskPaths.createChildren.collection,
    content: <CreateTaskCollection />,
  },
];