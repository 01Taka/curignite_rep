export const rootPaths = {
  top: "/top",
  auth: "/auth",
  main: "/app",
}

// Relative Paths
export const relativeAuthPaths = {
  signIn: `sign-in`,
  emailSignIn: `sign-in/with-email`,
  signUp: `sign-up`,
  createAccount: `sign-up/create-account`,
  accountEndpoint: `sign-up/create-account/endpoint`,
  initialSetup: `sign-up/initial-setup`,
};

// Relative Paths
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

export const mainRootPaths = {
  space: `${relativeMainPaths.space}/*`,
  chat: `${relativeMainPaths.chat}/*`,
  whiteboard: `${relativeMainPaths.whiteboard}/*`,
  calendar: `${relativeMainPaths.calendar}/*`,
  todo: `${relativeMainPaths.todo}/*`,
  team: `${relativeMainPaths.team}/*`,
  goal: `${relativeMainPaths.goal}/*`,
  qAndA: `${relativeMainPaths.qAndA}/*`,
}

// Auth Paths
export const authPaths = {
  base: rootPaths.auth,
  signIn: `${rootPaths.auth}/${relativeAuthPaths.signIn}`,
  emailSignIn: `${rootPaths.auth}/${relativeAuthPaths.emailSignIn}`,
  signUp: `${rootPaths.auth}/${relativeAuthPaths.signUp}`,
  createAccount: `${rootPaths.auth}/${relativeAuthPaths.createAccount}`,
  accountEndpoint: `${rootPaths.auth}/${relativeAuthPaths.accountEndpoint}`,
  initialSetup: `${rootPaths.auth}/${relativeAuthPaths.initialSetup}`,
}

// Main Paths
export const mainPaths = {
  base: rootPaths.main,
  space: `${rootPaths.main}/${relativeMainPaths.space}`,
  chat: `${rootPaths.main}/${relativeMainPaths.chat}`,
  whiteboard: `${rootPaths.main}/${relativeMainPaths.whiteboard}`,
  calendar: `${rootPaths.main}/${relativeMainPaths.calendar}`,
  todo: `${rootPaths.main}/${relativeMainPaths.todo}`,
  team: `${rootPaths.main}/${relativeMainPaths.team}`,
  goal: `${rootPaths.main}/${relativeMainPaths.goal}`,
  qAndA: `${rootPaths.main}/${relativeMainPaths.qAndA}`,
}

// Specific Path Groups
export const spacePaths = {
  base: mainPaths.space,
  start: `${mainPaths.space}/start`,
  startChildren: {
    setting: `${mainPaths.space}/start/setting`,
  },
  home: `${mainPaths.space}/home`,
}

export const chatPaths = {
  base: mainPaths.chat,
  index: `${mainPaths.chat}/index`,
}

export const whiteboardPaths = {
  base: mainPaths.whiteboard,
  index: `${mainPaths.whiteboard}/index`,
}

export const calendarPaths = {
  base: mainPaths.calendar,
  index: `${mainPaths.calendar}/index`,
}

export const todoPaths = {
  base: mainPaths.todo,
  index: `${mainPaths.todo}/index`,
}

export const teamPaths = {
  base: mainPaths.team,
  index: `${mainPaths.team}/index`,
  list: `${mainPaths.team}/list`,
  joinCreate: `${mainPaths.team}/actions`,
  create: `${mainPaths.team}/create`,
  join: `${mainPaths.team}/join`,
}

export const goalPaths = {
  base: mainPaths.goal,
  index: `${mainPaths.goal}/index`,
}

export const qAndAPaths = {
  base: mainPaths.qAndA,
  index: `${mainPaths.qAndA}/index`,
}

// Export Paths
export const paths = {
  top: rootPaths.top,
  auth: authPaths,
  main: {
    base: mainPaths.base,
    space: spacePaths,
    chat: chatPaths,
    whiteboard: whiteboardPaths,
    calendar: calendarPaths,
    todo: todoPaths,
    team: teamPaths,
    goal: goalPaths,
    qAndA: qAndAPaths,
  }
}

type PathOption = "" | "/" | "/*" | `/:${string}`;
/**
 * 指定されたパスの最後の部分（最後のスラッシュの後ろの部分）を返す関数
 * @param {string} path - パス文字列
 * @param {PathOption} pathOption - パスオプション
 * @returns {string} - パスの最後の部分
 */
export function toRelativePaths(path: string, pathOption: PathOption = ""): string {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new Error('パスは有効な文字列である必要があります');
  }

  const lastSlashIndex = path.lastIndexOf('/');
  
  if (lastSlashIndex === -1) {
    return `${path}${pathOption}`;
  }

  return `${path.substring(lastSlashIndex + 1)}${pathOption}`;
}
