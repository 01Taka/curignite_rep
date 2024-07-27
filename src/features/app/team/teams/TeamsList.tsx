import { FC } from "react";
import TeamContainer from "./TeamContainer";
import { countActiveMember } from "../../../../firebase/db/app/team/teamDBUtil";
import { TeamsListProps } from "../../../../types/app/teamTypes";

const TeamsList: FC<TeamsListProps> = ({ teamDataList, uid, currentDisplayTeamId, hideTeamsWithoutIds, onTeamClick }) => {
    return (
      <div className='flex flex-col items-center w-full mt-8'>
        {teamDataList.map((team) => (
          <>{(!hideTeamsWithoutIds || team.documentId) &&
            <div className='w-11/12 my-2' key={team.documentId} onClick={() => onTeamClick(team)}>
              <TeamContainer
                teamName={team.teamName}
                iconPath={team.iconPath}
                participantsName={team.participantsName}
                myTeam={team.authorUid === uid}
                currentDisplay={team.documentId === currentDisplayTeamId}
                participantsNumber={countActiveMember(team.participants)}
              />
            </div>
          }</>
        ))}
      </div>
    )
}

export default TeamsList;