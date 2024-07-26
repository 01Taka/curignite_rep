import { FC } from 'react'
import HomeView from './HomeView'
import { useNavigate } from 'react-router-dom';
import { centerElement, routeElements } from '../routes/mainItems';

const Home: FC = () => {
  const navigate = useNavigate();

  return <HomeView
    routeElements={routeElements}
    radius={190}
    centerItem={centerElement}
    angleAdjustment={-90}
    onNavigate={(path) => navigate(path)}
  />
}

export default Home