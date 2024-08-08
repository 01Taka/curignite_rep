import { rootPaths } from "./paths";

// Relative Auth Paths
export const relativeAuthPaths = {
  signIn: "sign-in",
  emailSignIn: "sign-in/with-email",
  signUp: "sign-up",
  createAccount: "sign-up/create-account",
  accountEndpoint: "sign-up/create-account/endpoint",
  initialSetup: "sign-up/initial-setup",
};

// Auth Paths
export const authPaths = Object.fromEntries(
  Object.entries(relativeAuthPaths).map(([key, value]) => [key, `${rootPaths.auth}/${value}`])
);
