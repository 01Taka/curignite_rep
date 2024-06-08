import React from 'react'
import Profile from '../../../components/app/profile/Profile'

interface HomeViewProps {

}

const HomeView: React.FC<HomeViewProps> = () => {
  return (
    <div>
        HomeView
        <div>
            <Profile />
        </div>
    </div>
  )
}

export default HomeView