import { FC } from "react";
import TeamContainer from "./TeamContainer";
import { TeamsListProps } from "../../../../types/app/teamTypes";
import { cn } from "../../../../functions/utils";

const TeamsList: FC<TeamsListProps> = ({ teamDataList, uid, currentDisplayTeamId, hideTeamsWithoutIds, onTeamClick }) => {
  
    return (
      <div className='flex flex-col items-center w-full mt-8'>
        {teamDataList.map((team) => (
          <div className={cn('w-11/12 my-2', (hideTeamsWithoutIds && !team.documentId) && "hidden")} onClick={() => onTeamClick(team)}>
            <TeamContainer
              teamName={team.teamName}
              iconPath={team.iconPath}
              participantsName={team.participantsName}
              myTeam={team.authorUid === uid}
              currentDisplay={team.documentId === currentDisplayTeamId}
              participantsNumber={team.members.length}
            />
          </div>
        ))}
      </div>
    )
}

export default TeamsList;