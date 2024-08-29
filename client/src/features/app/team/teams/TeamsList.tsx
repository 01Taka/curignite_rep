import { FC } from "react";
import TeamContainer from "./TeamContainer";
import { cn } from "../../../../functions/utils";
import { TeamData } from "../../../../types/firebase/db/team/teamsTypes";
import { DocumentIdMap } from "../../../../types/firebase/db/formatTypes";
import { Member } from "../../../../types/firebase/db/baseTypes";

export interface TeamsListProps {
  teams: TeamData[];
  learningMembersMap: DocumentIdMap<Member[]>;
  currentUserId: string;
  currentDisplayTeamId: string | undefined;
  hideTeamsWithoutIds?: boolean;
  onTeamClick: (team: TeamData) => void;
}

const TeamsList: FC<TeamsListProps> = ({ teams, learningMembersMap, currentUserId, currentDisplayTeamId, onTeamClick }) => {
    return (
      <div className='flex flex-col items-center w-full mt-8'>
        {teams && teams.map((team) => (
          <div key={team.docId} className={cn('w-11/12 my-2')} onClick={() => onTeamClick(team)}>
            <TeamContainer
              teamName={team.teamName}
              iconUrl={team.iconUrl ?? ""}
              learningMembers={learningMembersMap[team.docId]}
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