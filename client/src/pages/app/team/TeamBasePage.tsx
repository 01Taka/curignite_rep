import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { teamPaths } from '../../../types/path/mainPaths';

const TeamBasePage: FC = () => {
    const { device } = useAppSelector(state => state.userSlice);

    const navigate = useNavigate();
    useEffect(() => {
        switch (device) {
            case "mobile":
                navigate(teamPaths.list, { replace: true });
                break;
            case "desktop":
                navigate(teamPaths.base, { replace: true });
                break;
            default:
                break;
        }
    }, [navigate, device])
  return null;
}

export default TeamBasePage