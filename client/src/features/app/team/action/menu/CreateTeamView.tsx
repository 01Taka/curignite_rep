import { Typography } from '@mui/material';
import React, { FC, useMemo } from 'react';
import FormContainer from '../../../../../components/container/FormContainer';
import { StringField } from '../../../../../components/input/inputIndex';
import CheckBoxField from '../../../../../components/input/field/CheckBoxField';
import MultilineField from '../../../../../components/input/field/MultilineField';
import CircularButton from '../../../../../components/input/button/CircularButton';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { keyMirror } from '../../../../../functions/objectUtils';
import ImageUploadField from '../../../../../components/input/field/ImageUploadField';

export type CreateTeamFormState = {
  teamName: string;
  iconImage: File | null;
  description: string;
  requiresApproval: boolean;
};

interface CreateTeamViewProps {
  formState: CreateTeamFormState;
  onFormStateChange: FormStateChangeFunc;
  onCreate: () => void;
}

const CreateTeamView: FC<CreateTeamViewProps> = ({
  formState,
  onFormStateChange,
  onCreate,
}) => {
  const names = useMemo(() => keyMirror(formState), [formState]);

  return (
    <FormContainer>
      <Typography variant="h4" className="flex justify-center py-8">
        チームを作成
      </Typography>
      <div className="space-y-8">
        <StringField
          value={formState.teamName}
          label="チーム名"
          name={names.teamName}
          required
          onChange={onFormStateChange}
        />
        <ImageUploadField 
          label='チームアイコン'
          name={names.iconImage}
          value={formState.iconImage}
          onChange={onFormStateChange}
          shape='circle'
          borderStyle='dashed'
        />
        <CheckBoxField
          label="参加には承認が必要"
          name={names.requiresApproval}
          checked={formState.requiresApproval}
          onChange={onFormStateChange}
        />
        <MultilineField
          value={formState.description}
          label="チームの紹介"
          name={names.description}
          rows={5}
          onChange={onFormStateChange}
        />
      </div>
      <CircularButton size="lg" bgColor="main" onClick={onCreate} className='self-end'>
        作成する
      </CircularButton>
    </FormContainer>
  );
};

export default CreateTeamView;
