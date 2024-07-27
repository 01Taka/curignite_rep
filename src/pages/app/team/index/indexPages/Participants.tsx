import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../../../../redux/hooks';
import { UserWithTeamRole } from '../../../../../types/firebase/db/teamsTypes';
import { getCurrentUser } from '../../../../../firebase/auth/auth';
import { getTeamParticipantsUserData } from '../../../../../firebase/db/app/team/teamDBUtil';
import ParticipantsView from '../../../../../features/app/team/index/participants/ParticipantsView';

const Participants: FC = () => {
  const teamSlice = useAppSelector(state => state.teamSlice);
  const [participants, setParticipants] = useState<UserWithTeamRole[]>([]);
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
        const participants = await getTeamParticipantsUserData(team.roles, team.documentId);
        setParticipants(participants);
      }
    }

    updateMyTeam();
    updateParticipants();
  }, [teamSlice])

  if (!teamSlice.currentDisplayTeam) {
    return null;
  }
    
  return <ParticipantsView
    participants={participants}
    myTeam={myTeam}
  />
}

export default Participants