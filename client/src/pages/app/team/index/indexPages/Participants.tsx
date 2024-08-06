import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../../../../redux/hooks';
import ParticipantsView from '../../../../../features/app/team/index/participants/ParticipantsView';
import { MemberData } from '../../../../../types/firebase/db/baseTypes';
import { getMembersData } from '../../../../../functions/db/dbUtils';

const Participants: FC = () => {
  const teamSlice = useAppSelector(state => state.teamSlice);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [myTeam, setMyTeam] = useState(false);
  const { uid } = useAppSelector(state => state.userSlice);

  useEffect(() => {
    const team = teamSlice.currentDisplayTeam;

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
  }, [teamSlice, uid])

  if (!teamSlice.currentDisplayTeam) {
    return null;
  }
    
  return <ParticipantsView
    members={members}
    myTeam={myTeam}
  />
}

export default Participants