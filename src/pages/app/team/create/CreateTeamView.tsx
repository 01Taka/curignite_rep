import { Typography } from '@mui/material';
import React, { FC } from 'react';
import { StringField } from '../../../../components/input/inputIndex';
import MultilineField from '../../../../components/input/field/MultilineField';
import CheckBoxFiled from '../../../../components/input/field/CheckBoxFiled';
import EvenlyList from '../../../../components/container/EvenlyList';
import CircularButton from '../../../../components/input/button/CircularButton';
import FormContainer from '../../../../components/container/FormContainer';

export type CreateTeamFormState = {
  teamName: string;
  iconPath: string;
  password: string;
  requiredApproval: boolean;
  introduction: string;
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
      <EvenlyList 
        elements={[
          <StringField
            value={formState.teamName}
            label='チーム名'
            name='teamName'
            required
            onChange={onFormStateChange}
          />,
          <StringField
            value={formState.password}
            label='パスワード'
            name='password'
            onChange={onFormStateChange}
          />,
          <CheckBoxFiled 
            label='参加には承認が必要'
            name='requiredApproval'
            checked={formState.requiredApproval}
            onChange={onCheckboxChange}
          />,
          <MultilineField 
            value={formState.introduction}
            label='チームの紹介'
            name='introduction'
            rows={5}
            onChange={onFormStateChange}
          />,
          <div className='flex justify-end'>
            <CircularButton bgColor='main' className='mr-6' onClick={onCreate}><>チームを<br/>作成する</></CircularButton>
          </div>
        ]}
        betweenElement={<div className='my-4'/>}
      />
    </FormContainer>
  );
};

export default CreateTeamView;