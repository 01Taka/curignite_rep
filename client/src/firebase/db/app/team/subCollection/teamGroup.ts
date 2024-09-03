// import { DocumentReference } from "firebase/firestore";
// import { defaultTeamGroupPermissions, TeamGroupData, TeamGroupTag, TeamGroupVisibility } from "../../../../../types/firebase/db/team/teamGroupTypes";
// import BaseDB from "../../../base";
// import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
// import { Member } from "../../../../../types/firebase/db/baseTypes";

// /**
//  * TeamGroupsDB は、チームグループのデータベース操作を行うクラスです。
//  */
// export class TeamGroupsDB extends BaseDB<TeamGroupData> {
//     /**
//      * チームグループを作成します。
//      * @param createdById - グループを作成したユーザーのID
//      * @param groupName - グループの名前
//      * @param iconUrl - グループのアイコンURL（オプション）
//      * @param description - グループの説明（オプション）
//      * @param chatroomId - チャットルームID（オプション）
//      * @param members - グループのメンバーリスト（オプション）
//      * @param visibility - グループの公開設定（オプション）
//      * @param tags - グループに関連するタグ（オプション）
//      * @returns 作成したグループのドキュメント参照
//      * @throws エラーが発生した場合、エラーメッセージをスローします
//      */
//     async createTeamGroup(
//         createdById: string,
//         teamId: string,
//         groupName: string,
//         iconUrl?: string,
//         description: string = "",
//         chatroomId: string = "",
//         members: Member[] = [],
//         visibility: TeamGroupVisibility = "public",
//         tags: TeamGroupTag[] = []
//     ): Promise<DocumentReference<TeamGroupData>> {
//         try {
//             const data: TeamGroupData = {
//                 ...getInitialBaseDocumentData(createdById),
//                 teamId,
//                 groupName,
//                 iconUrl,
//                 description,
//                 chatroomId,
//                 members,
//                 permissions: defaultTeamGroupPermissions,
//                 visibility,
//                 invitedUsers: [],
//                 status: "active",
//                 tags
//             };

//             return await this.create(data);
//         } catch (error) {
//             console.error("Error creating team group:", error);
//             throw new Error("Failed to create team group.");
//         }
//     }

//     /**
//      * 指定されたIDのチームグループを取得します。
//      * @param groupId - グループのID
//      * @returns グループデータまたは null（データが存在しない場合）
//      * @throws エラーが発生した場合、null を返します
//      */
//     async getTeamGroup(groupId: string): Promise<TeamGroupData | null> {
//         try {
//             return await this.read(groupId);
//         } catch (error) {
//             console.error("Error fetching team group:", error);
//             return null;
//         }
//     }

//     /**
//      * 指定されたIDのチームグループを更新します。
//      * @param groupId - グループのID
//      * @param data - 更新するデータの部分集合
//      * @throws エラーが発生した場合、エラーメッセージをスローします
//      */
//     async updateTeamGroup(groupId: string, data: Partial<TeamGroupData>) {
//         try {
//             await this.update(groupId, data);
//         } catch (error) {
//             console.error("Error updating team group:", error);
//             throw new Error("Failed to update team group.");
//         }
//     }

//     /**
//      * 指定されたIDのチームグループを削除します。
//      * @param groupId - グループのID
//      * @throws エラーが発生した場合、エラーメッセージをスローします
//      */
//     async deleteTeamGroup(groupId: string) {
//         try {
//             await this.softDelete(groupId);
//         } catch (error) {
//             console.error("Error deleting team group:", error);
//             throw new Error("Failed to delete team group.");
//         }
//     }
// }
export {}