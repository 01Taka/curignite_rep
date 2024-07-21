import { ReactNode } from "react";

export interface NavigationItem {
    path: string;
    icon: ReactNode;
    name?: string;
}