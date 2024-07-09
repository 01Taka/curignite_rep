import { ReactNode } from "react";
import SpaceSetting from "../space/setting/SpaceSetting";
import TeamIndex from "../team/TeamIndex";

export interface RouteItemProps {
    path: string;
    element: ReactNode;
}

export interface routeElement {
    path: string;
    text: ReactNode;
    invalidation: boolean;
    explanation: string;
}


export const routeItems: RouteItemProps[] = [
    {path: 'space/', element: <SpaceSetting />},
    {path: 'chat~', element: <></>},
    {path: 'whiteboard~', element: <></>},
    {path: 'calendar~', element: <></>},
    {path: 'todo~', element: <></>},
    {path: 'team/*', element: <TeamIndex />},
    {path: 'goal~', element: <></>},
    {path: 'q-and-a~', element: <></>},
]

export const routeElements: routeElement[] = [
    {path: 'chat', text: 'チャット', invalidation: false, explanation: 'チャット機能です'},
    {path: 'whiteboard', text: <>ホワイト<br/>ボード</>, invalidation: false, explanation: '機能です'},
    {path: 'calendar', text: 'カレンダー', invalidation: false, explanation: '機能です'},
    {path: 'todo', text: 'タスク管理', invalidation: false, explanation: '機能です'},
    {path: 'team', text: 'チーム', invalidation: false, explanation: '機能です'},
    {path: 'goal', text: '目標宣言', invalidation: false, explanation: '機能です'},
    {path: 'q-and-a', text: 'Q&A', invalidation: false, explanation: '機能です'},
];

export const centerElement = {path: 'space', text: <>勉強を<br/>はじめる</>, invalidation: false, explanation: '機能です'}