import { Timestamp } from "firebase/firestore";
import { SerializableUser, User } from "../../../types/firebase/db/usersTypes";

// シリアライズ関数
export const serializeUserInfo = (user: User): SerializableUser => {
    return {
        ...user,
        createdAt: user.createdAt.toMillis(),
        birthDate: user.birthDate.toMillis(),
    };
};

// デシリアライズ関数
export const deserializeUserInfo = (data: SerializableUser): User => {
    return {
        ...data,
        createdAt: Timestamp.fromMillis(data.createdAt),
        birthDate: Timestamp.fromMillis(data.birthDate),
    };
};
