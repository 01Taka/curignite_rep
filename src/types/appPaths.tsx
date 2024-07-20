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
}

export const chatPaths = {
  base: mainPaths.chat,
}

export const whiteboardPaths = {
  base: mainPaths.whiteboard,
}

export const calendarPaths = {
  base: mainPaths.calendar,
}

export const todoPaths = {
  base: mainPaths.todo,
}

export const teamPaths = {
  base: mainPaths.team,
  index: `${mainPaths.team}/index`,
  create: `${mainPaths.team}/create`,
  join: `${mainPaths.team}/join`,
}

export const goalPaths = {
  base: mainPaths.goal,
}

export const qAndAPaths = {
  base: mainPaths.qAndA,
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
