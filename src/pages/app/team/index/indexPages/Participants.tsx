import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../../../../redux/hooks';
import { getCurrentUser } from '../../../../../firebase/auth/auth';
import ParticipantsView from '../../../../../features/app/team/index/participants/ParticipantsView';
import { MemberData } from '../../../../../types/firebase/db/baseTypes';
import { getMembersData } from '../../../../../functions/db/dbUtils';

const Participants: FC = () => {
  const teamSlice = useAppSelector(state => state.teamSlice);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [myTeam, setMyTeam] = useState(false);

  useEffect(() => {
    const team = teamSlice.currentDisplayTeam;

    const updateMyTeam = async () => {
      if (team) {
        const user = await getCurrentUser();
        setMyTeam(team.authorUid === user?.uid);
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
  }, [teamSlice])

  if (!teamSlice.currentDisplayTeam) {
    return null;
  }
    
  return <ParticipantsView
    members={members}
    myTeam={myTeam}
  />
}

export default Participants