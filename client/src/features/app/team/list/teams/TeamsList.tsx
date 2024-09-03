import { FC } from "react";
import TeamContainer from "./TeamContainer";
import { cn } from "../../../../../functions/utils";
import { TeamData } from "../../../../../types/firebase/db/team/teamStructure";

export interface TeamsListProps {
  teams: TeamData[];
  currentUserId: string;
  currentDisplayTeamId: string | undefined;
  hideTeamsWithoutIds?: boolean;
  onTeamClick: (team: TeamData) => void;
}

const TeamsList: FC<TeamsListProps> = ({ teams, currentUserId, currentDisplayTeamId, onTeamClick }) => {
    return (
      <div className='flex flex-col items-center w-full mt-8'>
        {teams && teams.map((team) => (
          <div key={team.docId} className={cn('w-11/12 my-2')} onClick={() => onTeamClick(team)}>
            <TeamContainer
              teamName={team.teamName}
              iconUrl={team.iconUrl ?? ""}
              myTeam={team.createdById === currentUserId}
              currentDisplay={team.docId === currentDisplayTeamId}
              memberNumber={team.members.length}
            />
          </div>
        ))}
      </div>
    )
}

export default TeamsList;