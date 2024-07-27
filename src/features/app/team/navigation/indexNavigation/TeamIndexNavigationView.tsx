import React, { FC } from 'react'
import Teams from '../../teams/Teams'
import CircularButton from '../../../../../components/input/button/CircularButton'
import { Home } from '@mui/icons-material'

interface TeamIndexNavigationViewProps {
    toHome: () => void;
}
const TeamIndexNavigationView: FC<TeamIndexNavigationViewProps> = ({ toHome }) => {
  return (
    <div className='relative'>
        <CircularButton className='absolute right-2 top-2' size="sm" onClick={toHome}>
            <Home />
        </CircularButton>
        <div className='pt-8'/>
        <Teams />
    </div>
  )
}

export default TeamIndexNavigationView