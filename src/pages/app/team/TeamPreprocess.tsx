import { useEffect } from 'react';
import { fetchApprovedTeamsFromUserData } from "../../../firebase/db/app/team/teamDBUtil";
import { initialTeamDataState, TeamData } from "../../../types/firebase/db/teamsTypes";
import { usersDB } from "../../../firebase/db/dbs";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setCurrentDisplayTeam, setTeamsNotFound, updateTeams, updateTeamsSuccess } from "../../../redux/slices/teamSlice";
import { serializeTeamData, serializeTeamDataArray } from '../../../functions/serialization/team/teamSerialization';

const TeamPreprocess = () => {
  const { currentDisplayTeam } = useAppSelector(state => state.teamSlice);
  const { uid } = useAppSelector(state => state.userDataSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const updateTeamData = async () => {
      try {
        if (uid) {
          const userTeamsData = await usersDB.getAllUserTeamsData(uid);

          if (userTeamsData.length === 0) {
            dispatch(setTeamsNotFound());
            return;
          }

          const temporaryTeamDataList: TeamData[] = userTeamsData.map(value => ({
            ...initialTeamDataState,
            teamName: value.teamName,
            iconPath: value.teamIconPath,
          }));

          dispatch(updateTeams(serializeTeamDataArray(temporaryTeamDataList)));

          const teamsData = await fetchApprovedTeamsFromUserData(uid, userTeamsData);

          if (teamsData.length === 0) {
            dispatch(setTeamsNotFound());
          } else {
            dispatch(updateTeamsSuccess(serializeTeamDataArray(teamsData)));

            if (!currentDisplayTeam) {
              dispatch(setCurrentDisplayTeam(serializeTeamData(teamsData[0])));
            }
          }
        }
      } catch (error) {
        console.error("Error updating team data: ", error);
      }
    };

    updateTeamData();
  }, [dispatch, uid, currentDisplayTeam]);

  return null;
};

export default TeamPreprocess;
