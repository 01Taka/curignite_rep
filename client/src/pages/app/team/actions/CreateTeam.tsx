import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateTeamView, { CreateTeamFormState } from '../../../../features/app/team/action/menu/CreateTeamView';
import serviceFactory from '../../../../firebase/db/factory';
import { handleFormStateChange } from '../../../../functions/utils';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { teamPaths } from '../../../../types/path/mainPaths';
import { navigateToTeamHome } from '../../../../redux/actions/team/teamActions';

const CreateTeam: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { name } = useParams<{ name: string }>();
  const { uid } = useAppSelector(state => state.userSlice);

  const [formState, setFormState] = useState<CreateTeamFormState>({
    teamName: '',
    iconImage: null,
    description: '',
    requiresApproval: true,
  });

  const [creating, setCreating] = useState(false);

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
        setCreating(true);
        const teamService = serviceFactory.createTeamService();
        const result = await teamService.createTeam(
          uid,
          formState.teamName,
          formState.iconImage,
          formState.description,
          formState.requiresApproval
        )
        navigateToTeamHome(result.documentRef.id, dispatch, navigate, teamPaths.homeChildren.setting);
      } else {
        console.error("uidが取得できませんでした。");
      }
    } catch (error) {
      // エラーハンドリング
      console.error('Error creating team:', error);
    }
    setCreating(false);
  };
  
  return (
    <CreateTeamView
      formState={formState}
      creating={creating}
      onFormStateChange={(e) => handleFormStateChange(e, setFormState)}
      onCreate={handleCreateTeam}
    />
  );
};

export default CreateTeam;
