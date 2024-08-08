import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { teamPaths } from '../../../types/path/mainPaths';
import { replaceParams } from '../../../functions/path/pathUtils';
import { PathParam } from '../../../types/path/paths';
import { setCurrentTeamId } from '../../../redux/slices/team/teamSlice';

const TeamBasePage: FC = () => {
    const { device } = useAppSelector(state => state.userSlice);
    const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    useEffect(() => {
        switch (device) {
            case "mobile":
                navigate(teamPaths.list, { replace: true });
                break;
            case "desktop":
                if (Object.keys(teams).length > 0) {
                    const teamId = currentTeamId || teams[Object.keys(teams)[0]].docId;
                    dispatch(setCurrentTeamId(teamId));
                    navigate(replaceParams(teamPaths.homeChildren.participants, { [PathParam.TeamId]: teamId }), { replace: true });
                }
                break;
            default:
                break;
        }
    }, [navigate, device]);
  return null;
}

export default TeamBasePage