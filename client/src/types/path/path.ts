import { ReactNode } from "react";

export interface NavigationItem<P = string> {
    path: P;
    icon: ReactNode;
    name?: string;
}