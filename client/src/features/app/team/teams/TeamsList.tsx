import { FC } from "react";
import TeamContainer from "./TeamContainer";
import { TeamsListProps } from "../../../../types/app/teamTypes";
import { cn } from "../../../../functions/utils";

const TeamsList: FC<TeamsListProps> = ({ teamDataList, uid, currentDisplayTeamId, onTeamClick }) => {
    return (
      <div className='flex flex-col items-center w-full mt-8'>
        {teamDataList && teamDataList.map((team) => (
          <div key={team.docId} className={cn('w-11/12 my-2')} onClick={() => onTeamClick(team)}>
            <TeamContainer
              teamId={team.docId}
              teamName={team.teamName}
              iconPath={team.iconPath}
              members={team.members}
              myTeam={team.createdById === uid}
              currentDisplay={team.docId === currentDisplayTeamId}
              memberNumber={team.members.length}
            />
          </div>
        ))}
      </div>
    )
}

export default TeamsList;