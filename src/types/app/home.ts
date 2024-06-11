import { ReactNode } from "react";

export interface SidebarElement {
    path: string;
    name: string;
    icon: ReactNode; 
}

export interface HomeRouteItem {
    path: string;
    element: ReactNode;
}
