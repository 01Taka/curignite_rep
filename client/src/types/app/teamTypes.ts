import { TeamData } from "../firebase/db/team/teamsTypes";

export interface TeamsListProps {
    teamDataList: TeamData[];
    uid: string;
    currentDisplayTeamId: string | undefined;
    hideTeamsWithoutIds?: boolean;
    onTeamClick: (team: TeamData) => void;
}