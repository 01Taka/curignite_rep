import { ReactNode } from "react";
import { mainIndexPaths, mainPaths } from "../../../types/path/appPaths";


export interface routeElement {
    path: string;
    text: ReactNode;
    invalidation: boolean;
    explanation: string;
}

export const routeElements: routeElement[] = [
    {path: mainIndexPaths.chat, text: 'チャット', invalidation: false, explanation: 'チャット機能です'},
    {path: mainIndexPaths.whiteboard, text: <>ホワイト<br/>ボード</>, invalidation: false, explanation: '機能です'},
    {path: mainIndexPaths.calendar, text: 'カレンダー', invalidation: false, explanation: '機能です'},
    {path: mainIndexPaths.todo, text: 'タスク管理', invalidation: false, explanation: '機能です'},
    {path: mainIndexPaths.team, text: 'チーム', invalidation: false, explanation: '機能です'},
    {path: mainIndexPaths.goal, text: '目標宣言', invalidation: false, explanation: '機能です'},
    {path: mainIndexPaths.qAndA, text: 'Q&A', invalidation: false, explanation: '機能です'},
];

export const centerElement = {path: 'space', text: <>勉強を<br/>はじめる</>, invalidation: false, explanation: '機能です'}