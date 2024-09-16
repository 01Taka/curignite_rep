import { FC } from 'react'
import HomeView from './HomeView'
import { LearningTimerProvider } from '../../../features/app/learningGoal/learningGoalWork/LearningTimerProvider'

const Home: FC = () => {
  return (
    <LearningTimerProvider>
      <HomeView />
    </LearningTimerProvider>
  )
}

export default Home