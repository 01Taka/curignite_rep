import React, { FC } from 'react'
import { useAppSelector } from '../../../../redux/hooks';
import ParticipantList from './participantList/ParticipantList';
import TeamHome from '../home/TeamHome';

export type TeamPages = "home" | "participants" | "chat" | "whiteboard";

const Team: FC = () => {
  const { displayTeamPage } = useAppSelector(state => state.teamSlice);

  switch (displayTeamPage) {
    case "home":
      return (
        <TeamHome />
      )
    case "participants":
      return (
        <ParticipantList />
      )
    case "chat":
      return (
        <></>
      )
    case "whiteboard":
      return (
        <></>
      )
    default:
      return null
  }
}

export default Team