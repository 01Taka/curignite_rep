import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../types/path/appPaths';
import { isMobileMode } from '../../../functions/utils';

const TeamBasePage: FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (isMobileMode()) {
            navigate(teamPaths.list, { replace: true });
        } else {
            navigate(teamPaths.index, { replace: true });
        }
    }, [navigate])
  return null;
}

export default TeamBasePage