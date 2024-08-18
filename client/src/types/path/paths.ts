import { ReactNode } from "react";

export interface NavigationItem<P = string> {
    path: P;
    icon: ReactNode;
    name?: string;
}

export enum PathParam {
    Wildcard = "*",
    TeamId = "teamId",
    SpaceId = "spaceId",
    Name = "name",
    CollectionId = "collectionId"
}

export type ParamReplace = Partial<Record<PathParam, string>>;

// Root Paths
export const rootPaths = {
  top: "/top",
  auth: "/auth",
  main: "/app",
};
