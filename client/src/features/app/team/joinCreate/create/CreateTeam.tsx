import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/hooks';
import CreateTeamView, { CreateTeamFormState } from './CreateTeamView';
import serviceFactory from '../../../../../firebase/db/factory';
import { handleFormStateChange } from '../../../../../functions/utils';
import { DocumentRefWithFileUrl } from '../../../../../types/firebase/db/baseTypes';

interface CreateTeamProps {
  onCreatedTeam: (result: DocumentRefWithFileUrl<"icon">) => void;
}

const CreateTeam: FC<CreateTeamProps> = ({ onCreatedTeam }) => {
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
        
        onCreatedTeam(result);
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
