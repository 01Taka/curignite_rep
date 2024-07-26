export type AnonymousStatus =
    | "public"
    | "communityOnly"
    | "private"

export type AuthStates =
    | "verified"
    | "noUserData"
    | "new"

export type RequestStatus = 'loading' | 'success' | 'error' | 'notFound';
