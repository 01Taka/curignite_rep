import { ReactNode } from "react";
import { mainPaths } from "../../../types/path/appPaths";


export interface routeElement {
    path: string;
    text: ReactNode;
    invalidation: boolean;
    explanation: string;
}

export const routeElements: routeElement[] = [
    {path: mainPaths.chat, text: 'チャット', invalidation: false, explanation: 'チャット機能です'},
    {path: mainPaths.whiteboard, text: <>ホワイト<br/>ボード</>, invalidation: false, explanation: '機能です'},
    {path: mainPaths.calendar, text: 'カレンダー', invalidation: false, explanation: '機能です'},
    {path: mainPaths.todo, text: 'タスク管理', invalidation: false, explanation: '機能です'},
    {path: mainPaths.team, text: 'チーム', invalidation: false, explanation: '機能です'},
    {path: mainPaths.goal, text: '目標宣言', invalidation: false, explanation: '機能です'},
    {path: mainPaths.qAndA, text: 'Q&A', invalidation: false, explanation: '機能です'},
];

export const centerElement = {path: 'space', text: <>勉強を<br/>はじめる</>, invalidation: false, explanation: '機能です'}