import { Timestamp } from "firebase/firestore";
import { teamCodesDB, teamsDB, usersDB } from "../../dbs";
import { TeamInfo, TeamRoles, TeamRolesKey } from "./teamsTypes";
import { UserTeamInfo } from "../user/usersTypes";

// 役割が承認されているか確認する関数
const checkIfRoleApproved = (role: TeamRolesKey): boolean => {
    return role === "admin" || role === "member";
};

// ユーザーがチームに属しているか確認する関数
const checkIfUserOnTheTeam = (uid: string, roles: TeamRoles): boolean => {
    return (
        roles.rejected?.includes(uid) === false &&
        (roles.member?.includes(uid) || roles.admin?.includes(uid))
    );
}

export const createTeam = async (uid: string, teamName: string, iconPath: string, password: string, requiredApproval: boolean, introduction: string, createdAt: Timestamp = Timestamp.now()): Promise<void> => {
    try {
        const teamData = await teamsDB.createTeam(teamName, iconPath, password, requiredApproval, introduction, uid, { admin: [uid] }, createdAt);
        
        // userDBのTeamInfoに作成したチームを追加
        await usersDB.createUserTeamInfo(uid, teamData.id, teamName, iconPath, "admin", true);
    } catch (error) {
        
    }
}

export const getTeamsFromUserTeamsInfo = async (uid: string, userTeamsInfo: UserTeamInfo[]): Promise<TeamInfo[]> => {
    // ユーザーのチーム情報から参加中のチームのIdを取得する。
    // その際、実際に参加が完了しているチームIdのみを取得する
    const teamIdList = userTeamsInfo
        .map(value => {
            if (checkIfRoleApproved(value.roles)) {
                return value.teamId;
            }
            return null;
        })
        .filter(id => id !== null) as string[];

    const teams = await Promise.all(teamIdList.map(async (id) => {
        const team = await teamsDB.read(id);

        if (team && checkIfUserOnTheTeam(uid, team.roles)) {
            return team;
        }
        return null;
    }));

    return teams.filter(team => team !== null) as TeamInfo[];
};

export const getParticipantsNumber = (roles: TeamRoles): number => {
    return roles.admin.length + roles.member.length;
}

export const getNewTeamCode = async (teamId: string): Promise<string> => {
    const codeData = await teamCodesDB.createTeamCode(teamId);
    return codeData.id;
}

export const joinRequest = async (uid: string, teamCode: string) => {
    try {
        const res = await teamCodesDB.read(teamCode);
        if (res) {
            const team = await teamsDB.read(res.teamId);
            if (team && !team.roles.rejected?.includes(uid)) {
                const pending = team.roles.pending;
                pending.push(uid);
                const roles: TeamRoles = {
                    ...team.roles,
                    pending,
                }

                await teamsDB.update(team.documentId, { roles });

                // userDBのTeamInfoに参加要請をしたチームを追加
                await usersDB.createUserTeamInfo(uid, team.documentId, team.teamName, team.iconPath, "pending", true);
            }
        }
    } catch (error) {
        
    }
}