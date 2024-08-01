// import { Timestamp } from "firebase/firestore";
// import { SerializableTeamData, TeamData } from "../../../types/firebase/db/team/teamsTypes";

// // シリアライズ関数
// export const serializeTeamData = (teamData: TeamData): SerializableTeamData => {
//     return {
//         ...teamData,
//         createdAt: teamData.createdAt.toMillis(),
//     };
// };

// export const serializeTeamDataArray = (teamData: TeamData[]): SerializableTeamData[] => {
//     return teamData.map(Data => ({
//         ...Data,
//         createdAt: Data.createdAt.toMillis(),
//     }));
// };

// // デシリアライズ関数
// export const deserializeTeamData = (data: SerializableTeamData): TeamData => {
//     return {
//         ...data,
//         createdAt: Timestamp.fromMillis(data.createdAt),
//     };
// };

// export const deserializeTeamDataArray = (data: SerializableTeamData[]): TeamData[] => {
//     return data.map(Data => ({
//         ...Data,
//         createdAt: Timestamp.fromMillis(Data.createdAt),
//     }));
// };


export {}