import { Typography } from '@mui/material';
import React, { FC, useMemo } from 'react';
import FormContainer from '../../../../components/container/FormContainer';
import { StringField } from '../../../../components/input/inputIndex';
import CheckBoxField from '../../../../components/input/field/CheckBoxFiled';
import MultilineField from '../../../../components/input/field/MultilineField';
import CircularButton from '../../../../components/input/button/CircularButton';
import { FormStateChangeFunc } from '../../../../types/util/componentsTypes';
import { keyMirror } from '../../../../functions/utils';

export type CreateTeamFormState = {
  teamName: string;
  iconPath: string;
  description: string;
  password: string;
  requiredApproval: boolean;
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
        <StringField
          value={formState.password}
          label="パスワード"
          name={names.password}
          onChange={onFormStateChange}
        />
        <CheckBoxField
          label="参加には承認が必要"
          name={names.requiredApproval}
          checked={formState.requiredApproval}
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
