import { ReactNode } from "react";
import { mainPaths } from "../../../types/path/mainPaths";

export interface routeElement {
    path: string;
    text: ReactNode;
    invalidation: boolean;
    explanation: string;
}

export const routeElements: routeElement[] = [
    {path: mainPaths.task, text: 'タスク管理', invalidation: false, explanation: '機能です'},
    {path: mainPaths.team, text: 'チーム', invalidation: false, explanation: '機能です'},
];

export const centerElement = {path: 'space', text: <>勉強を<br/>はじめる</>, invalidation: false, explanation: '機能です'}