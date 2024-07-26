import { spacesDB, usersDB } from "../../dbs";
import { fetchAllUsersInTeamsByUser, isActiveRole } from "../team/teamDBUtil";

export const getParticipationPossibleSpaces = async (uid: string) => {
    const members = await fetchAllUsersInTeamsByUser(uid);

    console.log(members);
    
    // 有効な役割を持つメンバーのユーザー情報を取得
    const users = await Promise.all(
        members
            .filter(member => isActiveRole(member.role)) // 有効な役割を持つメンバーかつ自分以外のみにフィルタ
            .map(async (member) => {
                const user = await usersDB.read(member.uid);
                return user ?? null; // `null`にして後でフィルタリング
            })
    );

    // 有効なユーザーのみを対象にスペース情報を取得
    const spacePromises = users
        .flatMap(user => user && user.spaceIds.map(async (spaceId) => await spacesDB.read(spaceId)));

    const spaces = await Promise.all(spacePromises);
    
    return spaces;
}
