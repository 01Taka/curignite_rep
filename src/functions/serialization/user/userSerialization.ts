import { Timestamp } from "firebase/firestore";
import { SerializableUserData, UserData } from "../../../types/firebase/db/usersTypes";

// シリアライズ関数
export const serializeUserData = (user: UserData): SerializableUserData => {
    return {
        ...user,
        createdAt: user.createdAt.toMillis(),
        birthDate: user.birthDate.toMillis(),
    };
};

// デシリアライズ関数
export const deserializeUserData = (data: SerializableUserData): UserData => {
    return {
        ...data,
        createdAt: Timestamp.fromMillis(data.createdAt),
        birthDate: Timestamp.fromMillis(data.birthDate),
    };
};
