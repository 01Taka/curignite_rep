export type AnonymousStatus =
    | "public"
    | "communityOnly"
    | "private"


export const defaultIconUrl = "https://firebasestorage.googleapis.com/v0/b/curignite-33bbc.appspot.com/o/userIcons%2Fdefault.png?alt=media&token=54c2c2e3-6335-4d41-9c32-cff2a730702c"


export type AuthStates =
    | "verified"
    | "noUserData"
    | "new"

export type WidthValueClasses = 
    | 'w-0' | 'w-1' | 'w-2' | 'w-3' | 'w-4' | 'w-5' | 'w-6' | 'w-7' | 'w-8' | 'w-9' | 'w-10'
    | 'w-11' | 'w-12' | 'w-16' | 'w-20' | 'w-24' | 'w-28' | 'w-32' | 'w-36' | 'w-40'
    | 'w-44' | 'w-48' | 'w-52' | 'w-56' | 'w-60' | 'w-64' | 'w-72' | 'w-80' | 'w-96';

export type HeightValueClasses = 
    | 'h-0' | 'h-1' | 'h-2' | 'h-3' | 'h-4' | 'h-5' | 'h-6' | 'h-7' | 'h-8' | 'h-9' | 'h-10'
    | 'h-11' | 'h-12' | 'h-16' | 'h-20' | 'h-24' | 'h-28' | 'h-32' | 'h-36' | 'h-40'
    | 'h-44' | 'h-48' | 'h-52' | 'h-56' | 'h-60' | 'h-64' | 'h-72' | 'h-80' | 'h-96';

export type WidthClasses = 
    WidthValueClasses | 'w-auto' | 'w-full' | 'w-screen' | 'w-min' | 'w-max' | 'w-fit';

export type HeightClasses = 
    WidthValueClasses | 'h-auto' | 'h-full' | 'h-screen' | 'h-min' | 'h-max' | 'h-fit';
