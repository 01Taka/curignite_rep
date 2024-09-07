import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
// import { spacePaths } from '../../../types/path/mainPaths';

const SpaceBasePage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
      // navigate(spacePaths.start, { replace: true });
  }, [navigate]);
  return null;
}

export default SpaceBasePage