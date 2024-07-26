import React, { FC } from 'react'
import IndexNavigationView from './IndexNavigationView'
import { useAppDispatch } from '../../../../../redux/hooks'
import { setDisplayTeamPage } from '../../../../../redux/slices/teamSlice';

const IndexNavigation: FC = () => {
  const dispatch = useAppDispatch();

  const handleToHome = () => {
    dispatch(setDisplayTeamPage("home"));
  }

  return <IndexNavigationView 
    toHome={handleToHome}
  />
}

export default IndexNavigation