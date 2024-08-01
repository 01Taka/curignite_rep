// import { activeRoles, ParticipantRoles, Participants, UserRoleAssignment } from "../../types/firebase/db/baseTypes";

// // 役割がアクティブであるかを確認する関数
// export const isActiveRole = (role: ParticipantRoles, actives: ParticipantRoles[] = activeRoles): boolean => {
//     return actives.includes(role);
// };

// // ユーザーがチームのアクティブメンバーに含まれるかを確認する関数
// export const isUserActiveMember = (uid: string, participants: Participants, actives: ParticipantRoles[] = activeRoles): boolean => {
//     if (!participants) {
//         return false;
//     }

//     return actives.some((activeKey) => participants[activeKey]?.includes(uid));
// };

// // アクティブメンバーの数を数える関数
// export const countActiveMember = (participants: Participants, actives: ParticipantRoles[] = activeRoles): number => {
//     if (!participants) {
//         return 0;
//     }
    
//     return actives.reduce((count, activeKey) => {
//         return count + (participants[activeKey]?.length || 0);
//     }, 0);
// };

// // 参加者をユーザーの役割にマッピングする関数
// export const mapParticipantsToUserRoles = <T>(participants: Participants, info: T, excludeRoles: ParticipantRoles[] = []): UserRoleAssignment<T>[] => {
//     if (!participants) {
//         return [];
//     }

//     const usersRoleInTeam: UserRoleAssignment<T>[] = [];

//     for (const role of Object.keys(participants) as ParticipantRoles[]) {
//         if (excludeRoles.includes(role)) {
//             continue;
//         }

//         const uids = participants[role] || [];
//         for (const uid of uids) {
//             usersRoleInTeam.push({
//                 uid,
//                 role,
//                 info,
//             });
//         }
//     }
//     return usersRoleInTeam;
// };