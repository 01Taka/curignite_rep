import React, { FC } from 'react'
import { useAppSelector } from '../../../../redux/hooks';
import TeamHome from './indexPages/TeamHome';
import Participants from './indexPages/Participants';

export type TeamPages = "home" | "participants" | "chat" | "whiteboard";

const TeamIndex: FC = () => {
  const { displayTeamPage } = useAppSelector(state => state.teamSlice);

  switch (displayTeamPage) {
    case "home":
      return (
        <TeamHome />
      )
    case "participants":
      return (
        <Participants />
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

export default TeamIndex