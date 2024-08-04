import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateTeamView, { CreateTeamFormState } from '../../../../features/app/team/action/CreateTeamView';
import serviceFactory from '../../../../firebase/db/factory';
import { handleFormStateChange } from '../../../../functions/utils';
import { getCurrentUser } from '../../../../firebase/auth/auth';

const CreateTeam: FC = () => {
  const { name } = useParams<{ name: string }>();

  const [formState, setFormState] = useState<CreateTeamFormState>({
    teamName: '',
    iconPath: '',
    description: '',
    password: '',
    requiredApproval: true,
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
      const user = await getCurrentUser();
      if (user) {
        const uid = user.uid;
        const teamService = serviceFactory.createTeamService(uid);
        await teamService.createTeam(
          uid, formState.teamName,
          formState.iconPath, 
          formState.description,
          formState.password, 
          formState.requiredApproval
        )
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
