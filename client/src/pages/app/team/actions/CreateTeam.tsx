import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateTeamView, { CreateTeamFormState } from '../../../../features/app/team/action/menu/CreateTeamView';
import serviceFactory from '../../../../firebase/db/factory';
import { handleFormStateChange } from '../../../../functions/utils';
import { useAppSelector } from '../../../../redux/hooks';
import { teamPaths } from '../../../../types/path/mainPaths';
import { replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam } from '../../../../types/path/paths';

const CreateTeam: FC = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const { uid } = useAppSelector(state => state.userSlice);

  const [formState, setFormState] = useState<CreateTeamFormState>({
    teamName: '',
    iconImage: null,
    description: '',
    requiresApproval: true,
  });

  useEffect(() => {
    if (name) {
      
      setFormState((prevState) => ({
        ...prevState,
        teamName: name,
      }));
    }
  }, [name]);

  const handleCreateTeam = async () => {
    try {
      // チームの作成と追加
      if (uid) {
        const userTeamService = serviceFactory.createUserTeamService();
        const teamRef = await userTeamService.createTeam(
          uid,
          formState.teamName,
          formState.iconImage,
          formState.description,
          formState.requiresApproval
        )
        navigate(replaceParams(teamPaths.homeChildren.setting, { [PathParam.TeamId]: teamRef.id }));
      } else {
        throw new Error("uidが取得できませんでした。");
      }
    } catch (error) {
      // エラーハンドリング
      console.error('Error creating team:', error);
    }
  };
  
  return (
    <CreateTeamView
      formState={formState}
      onFormStateChange={(e) => handleFormStateChange(e, setFormState)}
      onCreate={handleCreateTeam}
    />
  );
};

export default CreateTeam;
