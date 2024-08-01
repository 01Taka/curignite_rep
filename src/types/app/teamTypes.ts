import { TeamData } from "../firebase/db/team/teamsTypes";
import { RequestStatus } from "../util/stateTypes";

export type TeamRequestStatus = RequestStatus | "temporary";

export interface TeamsListProps {
    teamDataList: TeamData[];
    uid: string;
    currentDisplayTeamId: string | undefined;
    hideTeamsWithoutIds?: boolean;
    onTeamClick: (team: TeamData) => void;
}