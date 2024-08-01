import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../redux/hooks';
import CreateTeamView, { CreateTeamFormState } from '../../../../features/app/team/action/CreateTeamView';
import { createTeam } from '../../../../firebase/db/app/team/teamsDBUtil';

const CreateTeam: FC = () => {
  const { name } = useParams<{ name: string }>();
  const userData = useAppSelector(state => state.userDataSlice);

  const [formState, setFormState] = useState<CreateTeamFormState>({
    teamName: '',
    iconPath: '',
    password: '',
    requiredApproval: true,
    introduction: '',
  });

  useEffect(() => {
    console.log(name);
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
      const uid = userData.uid;
      if (uid) {
        await createTeam(
          uid,
          formState.teamName,
          formState.iconPath, 
          formState.password, 
          formState.requiredApproval, 
          formState.introduction
        )
      } else {
        throw new Error("uidが取得できませんでした。");
      }
    } catch (error) {
      // エラーハンドリング
      console.error('Error creating team:', error);
    }
  };
  
  const handleFormStateChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <CreateTeamView
      formState={formState}
      onFormStateChange={handleFormStateChange}
      onCheckboxChange={handleCheckboxChange}
      onCreate={handleCreateTeam}
    />
  );
};

export default CreateTeam;
