import { Typography } from '@mui/material';
import React, { FC } from 'react';
import FormContainer from '../../../../components/container/FormContainer';
import { StringField } from '../../../../components/input/inputIndex';
import CheckBoxFiled from '../../../../components/input/field/CheckBoxFiled';
import MultilineField from '../../../../components/input/field/MultilineField';
import CircularButton from '../../../../components/input/button/CircularButton';

export type CreateTeamFormState = {
  teamName: string;
  iconPath: string;
  description: string;
  password: string;
  requiredApproval: boolean;
};

interface CreateTeamViewProps {
  formState: CreateTeamFormState;
  onFormStateChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
}

const CreateTeamView: FC<CreateTeamViewProps> = ({
  formState,
  onFormStateChange,
  onCheckboxChange,
  onCreate,
}) => {
  return (
    <FormContainer>
      <Typography variant='h4' className='flex justify-center py-8'>
            チームを作成
      </Typography>
      <div className='space-y-8'>
        <StringField
          value={formState.teamName}
          label='チーム名'
          name='teamName'
          required
          onChange={onFormStateChange}
        />
        <StringField
          value={formState.password}
          label='パスワード'
          name='password'
          onChange={onFormStateChange}
        />
        <CheckBoxFiled
          label='参加には承認が必要'
          name='requiredApproval'
          checked={formState.requiredApproval}
          onChange={onCheckboxChange}
        />
        <MultilineField
          value={formState.description}
          label='チームの紹介'
          name='introduction'
          rows={5}
          onChange={onFormStateChange}
        />
      </div>
      <CircularButton size="lg" bgColor="main" onClick={onCreate}>
        作成する
      </CircularButton>
    </FormContainer>
  );
};

export default CreateTeamView;