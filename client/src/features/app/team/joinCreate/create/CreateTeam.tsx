import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/hooks';
import CreateTeamView, { CreateTeamFormState } from './CreateTeamView';
import { TeamData } from '../../../../../types/firebase/db/team/teamStructure';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import useFormState from '../../../../hooks/form/useFormState';

interface CreateTeamProps {
  onCreatedTeam: (teamRef: DocumentReference<TeamData, DocumentData>) => void;
}

const CreateTeam: FC<CreateTeamProps> = ({ onCreatedTeam }) => {
  const { name } = useParams<{ name: string }>();
  const { uid } = useAppSelector(state => state.userSlice);

  const { formState, onChangeFormState } = useFormState<CreateTeamFormState>({
    teamName: '',
    iconImage: null,
    description: '',
    requiresApproval: true,
  });

  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (name) {
      onChangeFormState({ name: 'teamName', value: name });
    }
  }, [name]);

  const handleCreateTeam = async () => {
    try {
      // チームの作成と追加
      // if (uid) {
      //   setCreating(true);
      //   const teamService = serviceFactory.createTeamService();
      //   const result = await teamService.createTeam(
      //     uid,
      //     formState.teamName,
      //     formState.iconImage,
      //     formState.description,
      //     formState.requiresApproval
      //   )
        
      //   onCreatedTeam(result);
      // } else {
      //   console.error("uidが取得できませんでした。");
      // } //OUT//
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
      onChangeFormState={onChangeFormState}
      onCreate={handleCreateTeam}
    />
  );
};

export default CreateTeam;
