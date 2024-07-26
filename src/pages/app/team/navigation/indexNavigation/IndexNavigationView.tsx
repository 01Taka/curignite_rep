import React, { FC } from 'react'
import TeamList from '../teamList/TeamList'
import CircularButton from '../../../../../components/input/button/CircularButton'
import { Home } from '@mui/icons-material'

interface IndexNavigationViewProps {
    toHome: () => void;
}
const IndexNavigationView: FC<IndexNavigationViewProps> = ({ toHome }) => {
  return (
    <div className='relative'>
        <CircularButton className='absolute right-2 top-2' size="sm" onClick={toHome}>
            <Home />
        </CircularButton>
        <TeamList />
    </div>
  )
}

export default IndexNavigationView