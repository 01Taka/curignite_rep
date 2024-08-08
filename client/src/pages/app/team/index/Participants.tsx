import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../../../redux/hooks';
import ParticipantsView from '../../../../features/app/team/home/participants/ParticipantsView';
import { MemberData } from '../../../../types/firebase/db/baseTypes';
import { getMembersData } from '../../../../functions/db/dbUtils';

const Participants: FC = () => {
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);
  const currentDisplayTeam = teams[currentTeamId];
  const [members, setMembers] = useState<MemberData[]>([]);
  const [myTeam, setMyTeam] = useState(false);
  const { uid } = useAppSelector(state => state.userSlice);

  useEffect(() => {
    const team = currentDisplayTeam;

    const updateMyTeam = async () => {
      if (team && uid) {
        setMyTeam(team.authorUid === uid);
      }
    }
    
    const updateParticipants = async () => {
      if (team) {
        const members = await getMembersData(team.members);
        setMembers(members);
      }
    }

    updateMyTeam();
    updateParticipants();
  }, [currentDisplayTeam, uid])

  if (!currentDisplayTeam) {
    return null;
  }
    
  return <ParticipantsView
    members={members}
    myTeam={myTeam}
  />
}

export default Participants