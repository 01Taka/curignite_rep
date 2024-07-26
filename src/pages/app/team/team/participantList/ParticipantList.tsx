import React, { FC, useEffect, useState } from 'react'
import ParticipantListView from './ParticipantListView'
import { useAppSelector } from '../../../../../redux/hooks'
import { getTeamParticipantsUserData } from '../../../../../firebase/db/app/team/teamDBUtil';
import { UserWithTeamRole } from '../../../../../types/firebase/db/teamsTypes';
import { getCurrentUser } from '../../../../../firebase/auth/auth';

const ParticipantList: FC = () => {
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
    
  return <ParticipantListView 
    participants={participants}
    myTeam={myTeam}
  />
}

export default ParticipantList