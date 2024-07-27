import { Timestamp } from "firebase/firestore";
import { teamCodesDB, teamsDB, usersDB } from "../../dbs";
import { TeamData, TeamParticipants, TeamRoles, UserWithTeamRole, UserRoleAssignment, activeRoles } from "../../../../types/firebase/db/teamsTypes";
import { UserTeamData } from "../../../../types/firebase/db/usersTypes";

// 役割がアクティブであるかを確認する関数
export const isActiveRole = (role: TeamRoles): boolean => {
    return activeRoles.includes(role);
};

// ユーザーがチームのアクティブメンバーに含まれるかを確認する関数
const isUserActiveInTeam = (uid: string, participants: TeamParticipants): boolean => {
    if (!participants) {
        return false;
    }

    return (
        participants.rejected?.includes(uid) === false &&
        (participants.regularMember?.includes(uid) || participants.admin?.includes(uid))
    );
}

export const createTeam = async (uid: string, teamName: string, iconPath: string, password: string, requiredApproval: boolean, introduction: string, createdAt: Timestamp = Timestamp.now()): Promise<void> => {
    try {
        const teamData = await teamsDB.createTeam(teamName, iconPath, password, requiredApproval, introduction, uid, { admin: [uid] }, createdAt);
        
        // userDBのTeamDataに作成したチームを追加
        await usersDB.createUserTeamData(uid, teamData.id, teamName, iconPath, "admin", true);
    } catch (error) {
        console.error("Error creating team:", error);
    }
}

export const getParticipatingTeamsByUid = async (uid: string): Promise<TeamData[]> => {
    try {
        const userTeamsData = await usersDB.getAllUserTeamsData(uid);

        if (userTeamsData) {
            return await fetchApprovedTeamsFromUserData(uid, userTeamsData);
        }
    } catch (error) {
        console.error("Error fetching participating teams:", error);
    }
    return [];
}

// UserデータのサブコレクションのUserTeamsDataに含まるチームデータを取得
export const fetchApprovedTeamsFromUserData = async (uid: string, userTeamsData: UserTeamData[]): Promise<TeamData[]> => {
    try {
        const teamIdList = userTeamsData
            .map(value => {
                if (isActiveRole(value.role)) {
                    return value.teamId;
                }
                return null;
            })
            .filter(id => id !== null) as string[];

        const teams = await Promise.all(teamIdList.map(async (id) => {
            const team = await teamsDB.read(id);

            if (team && team.participants && isUserActiveInTeam(uid, team.participants)) {
                return team;
            }
            return null;
        }));

        return teams.filter(team => team !== null) as TeamData[];
    } catch (error) {
        console.error("Error fetching approved teams from user data:", error);
        return [];
    }
};

export const countActiveMember = (participants: TeamParticipants): number => {
    if (!participants) {
        return 0;
    }
    return (participants.admin ? participants.admin.length : 0) 
         + (participants.regularMember ? participants.regularMember.length : 0);
}

export const getNewTeamCode = async (teamId: string): Promise<string> => {
    try {
        const codeData = await teamCodesDB.createTeamCode(teamId);
        return codeData.id;
    } catch (error) {
        console.error("Error getting new team code:", error);
        throw error;
    }
}

// チームコードに対応するチームの保留中に新しくUidを追加
export const sendRequestToJoinTeam = async (uid: string, teamCode: string) => {
    try {
        const res = await teamCodesDB.read(teamCode);
        if (res) {
            const team = await teamsDB.read(res.teamId);
            if (team && team.participants && !team.participants.rejected?.includes(uid)) {
                const pending = team.participants.pending || [];
                pending.push(uid);
                const participants: TeamParticipants = {
                    ...team.participants,
                    pending,
                }

                await teamsDB.update(team.documentId, { participants });

                // userDBのTeamDataに参加要請をしたチームを追加
                await usersDB.createUserTeamData(uid, team.documentId, team.teamName, team.iconPath, "pending", true);
            }
        }
    } catch (error) {
        console.error("Error sending request to join team:", error);
    }
}

export const getTeamParticipantsUserData = async (participants: TeamParticipants, teamId: string): Promise<UserWithTeamRole[]> => {
    const usersRoleInTeam = mapParticipantsToUserRoles(participants, teamId);
    const teamUsersData: UserWithTeamRole[] = [];

    await Promise.all(usersRoleInTeam.map(async (userInfo) => {
        try {
            const user = await usersDB.read(userInfo.uid);
            if (user) {
                teamUsersData.push({ userData: user, teamId: userInfo.teamId, role: userInfo.role });
            }
        } catch (error) {
            console.error("Error fetching user data for team participant:", error);
        }
    }))

    return teamUsersData;
};

export const mapParticipantsToUserRoles = (participants: TeamParticipants, teamId: string, excludeRoles: TeamRoles[] = []): UserRoleAssignment[] => {
    const usersRoleInTeam: UserRoleAssignment[] = [];

    if (!participants) {
        return [];
    }

    for (const key of Object.keys(participants)) {
        const role = key as keyof TeamParticipants;

        if (excludeRoles.includes(role)) {
            continue;
        }

        const uids = participants[role] || [];

        for (const uid of uids) {
            usersRoleInTeam.push({
                uid,
                role,
                teamId,
            })
        }
    }
    return usersRoleInTeam;
}

// 同じチームに参加している他のユーザーを取得
export const fetchAllUsersInTeamsByUser = async (uid: string, excludeRoles: TeamRoles[] = []): Promise<UserRoleAssignment[]> => {
    try {
        const teams = await getParticipatingTeamsByUid(uid);
        const usersRoleInTeam: UserRoleAssignment[] = teams.flatMap(team => {
            return mapParticipantsToUserRoles(team.participants, team.documentId, excludeRoles);
        });
        return usersRoleInTeam;
    } catch (error) {
        console.error("Error fetching all users in teams by user:", error);
        return [];
    }
}
