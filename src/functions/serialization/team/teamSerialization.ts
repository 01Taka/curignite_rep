import { Timestamp } from "firebase/firestore";
import { SerializableTeamInfo, TeamInfo } from "../../../types/firebase/db/teamsTypes";

// シリアライズ関数
export const serializeTeamInfo = (teamInfo: TeamInfo): SerializableTeamInfo => {
    return {
        ...teamInfo,
        createdAt: teamInfo.createdAt.toMillis(),
    };
};

export const serializeTeamInfoArray = (teamInfo: TeamInfo[]): SerializableTeamInfo[] => {
    return teamInfo.map(info => ({
        ...info,
        createdAt: info.createdAt.toMillis(),
    }));
};

// デシリアライズ関数
export const deserializeTeamInfo = (data: SerializableTeamInfo): TeamInfo => {
    return {
        ...data,
        createdAt: Timestamp.fromMillis(data.createdAt),
    };
};

export const deserializeTeamInfoArray = (data: SerializableTeamInfo[]): TeamInfo[] => {
    return data.map(info => ({
        ...info,
        createdAt: Timestamp.fromMillis(info.createdAt),
    }));
};


