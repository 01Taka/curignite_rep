import { ReactNode } from "react";

export interface SidebarElement {
    name: string;
    link: string;
    icon: ReactNode; 
}

export interface HomeRouteItem {
    path: string;
    element: ReactNode;
}
