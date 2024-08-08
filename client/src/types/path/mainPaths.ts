import { PathParam, rootPaths } from "./paths";

// Relative Main Paths
export const relativeMainPaths = {
  space: 'space',
  chat: 'chat',
  whiteboard: 'whiteboard',
  calendar: 'calendar',
  todo: 'todo',
  team: 'team',
  goal: 'goal',
  qAndA: 'q-and-a',
};

// 型定義
type RelativeMainPathsType = typeof relativeMainPaths;

type MainRootPathsType = {
  [K in keyof RelativeMainPathsType]: `${RelativeMainPathsType[K]}/*`
};

type MainPathsType = {
  [K in keyof RelativeMainPathsType]: `${typeof rootPaths.main}/${RelativeMainPathsType[K]}`
};

// Main Root Paths with Wildcards
export const mainRootPaths: MainRootPathsType = Object.fromEntries(
  Object.entries(relativeMainPaths).map(([key, value]) => [key, `${value}/*`])
) as MainRootPathsType;

// Main Paths
export const mainPaths: MainPathsType = Object.fromEntries(
  Object.entries(relativeMainPaths).map(([key, value]) => [key, `${rootPaths.main}/${value}`])
) as MainPathsType;

// Specific Path Groups
export const spacePaths = {
  base: mainPaths.space,
  start: `${mainPaths.space}/start`,
  startChildren: {
    setting: `${mainPaths.space}/start/setting`,
    joinProcessing: `${mainPaths.space}/start/join-processing/:${PathParam.SpaceId}`,
  },
  home: `${mainPaths.space}/home/:${PathParam.SpaceId}`,
};

export const chatPaths = {
  base: mainPaths.chat,
  index: `${mainPaths.chat}/index`,
};

export const whiteboardPaths = {
  base: mainPaths.whiteboard,
  index: `${mainPaths.whiteboard}/index`,
};

export const calendarPaths = {
  base: mainPaths.calendar,
  index: `${mainPaths.calendar}/index`,
};

export const todoPaths = {
  base: mainPaths.todo,
  index: `${mainPaths.todo}/index`,
};

export const teamPaths = {
  base: mainPaths.team,
  home: `${mainPaths.team}/home/:${PathParam.TeamId}`,
  homeChildren: {
    participants: `${mainPaths.team}/home/:${PathParam.TeamId}/participants`,
    chat: `${mainPaths.team}/home/:${PathParam.TeamId}/chat`,
    whiteboard: `${mainPaths.team}/home/:${PathParam.TeamId}/whiteboard`,
  },
  list: `${mainPaths.team}/list`,
  menu: `${mainPaths.team}/menu`,
  create: `${mainPaths.team}/create/:${PathParam.Name}`,
  join: `${mainPaths.team}/join`,
};

export const goalPaths = {
  base: mainPaths.goal,
  index: `${mainPaths.goal}/index`,
};

export const qAndAPaths = {
  base: mainPaths.qAndA,
  index: `${mainPaths.qAndA}/index`,
};
