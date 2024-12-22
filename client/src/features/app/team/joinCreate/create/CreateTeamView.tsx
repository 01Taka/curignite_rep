import { CircularProgress, Typography } from '@mui/material';
import React, { FC, useMemo } from 'react';
import FormContainer from '../../../../../components/container/FormContainer';
import { StringField } from '../../../../../components/input/inputIndex';
import CheckBoxField from '../../../../../components/input/field/CheckBoxField';
import MultilineField from '../../../../../components/input/field/MultilineField';
import CircularButton from '../../../../../components/input/button/CircularButton';
import { keyMirror } from '../../../../../functions/utils/dataStructureUtils/objectUtils';
import ImageUploadField from '../../../../../components/input/field/ImageUploadField';
import { FormStateChangeAction } from '../../../../../types/app/formStateTypes';

export type CreateTeamFormState = {
  teamName: string;
  iconImage: File | null;
  description: string;
  requiresApproval: boolean;
};

interface CreateTeamViewProps {
  formState: CreateTeamFormState;
  creating: boolean;
  onChangeFormState: (action: FormStateChangeAction) => void;
  onCreate: () => void;
}

const CreateTeamView: FC<CreateTeamViewProps> = ({
  formState,
  creating,
  onChangeFormState,
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
          onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })}
        />
        <ImageUploadField 
          label='チームアイコン'
          name={names.iconImage}
          value={formState.iconImage}
          onChangeFormState={onChangeFormState}
          shape='circle'
          borderStyle='dashed'
        />
        <CheckBoxField
          label="参加には承認が必要"
          name={names.requiresApproval}
          checked={formState.requiresApproval}
          onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })}
        />
        <MultilineField
          value={formState.description}
          label="チームの紹介"
          name={names.description}
          rows={5}
          onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })}
        />
      </div>
      <CircularButton size="lg" bgColor="main" onClick={onCreate} className='ml-auto mt-2' invalidation={creating}>
        {creating ? <CircularProgress /> : <>作成する</>}
      </CircularButton>
    </FormContainer>
  );
};

export default CreateTeamView;
