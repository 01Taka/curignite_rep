import React, { FC } from 'react';
import { Typography } from '@mui/material';
import { SpaceStartFormState } from '../SpaceStartView';
import { FormStateChangeEvent, SelectFieldChange } from '../../../../../types/componentsTypes';
import EditNoteIcon from '@mui/icons-material/EditNote';
import StringField from '../../../../../components/input/field/StringField';
import MultilineField from '../../../../../components/input/field/MultilineField';
import CheckBoxFiled from '../../../../../components/input/field/CheckBoxFiled';
import CircularButton from '../../../../../components/input/button/CircularButton';
import SelectField from '../../../../../components/input/field/SelectFiled';
import { publicationTargetForSelect } from '../../../../../types/firebase/db/spacesTypes';
import FormContainer from '../../../../../components/container/FormContainer';

interface SpaceSettingProps {
  formState: SpaceStartFormState;
  onChangeFormState: (event: FormStateChangeEvent) => void;
  onCompletion: () => void;
}

const SpaceSetting: FC<SpaceSettingProps> = ({ formState, onChangeFormState, onCompletion }) => {
  return (
    <FormContainer flexCenter>
      <div className='flex justify-center w-full h-full'>
        <div className='flex flex-col w-11/12 space-y-5 mt-4'>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            <EditNoteIcon sx={{ fontSize: 'inherit', mr: 1 }} />
            スペースの設定
          </Typography>
          <StringField
            label='スペース名'
            type="text"
            name="spaceName"
            value={formState.spaceName}
            onChange={onChangeFormState}
          />
          <MultilineField
            label='紹介文'
            rows={4}
            name="introduction"
            value={formState.introduction}
            onChange={onChangeFormState}
          />
          <SelectField
            label='公開対象'
            value={formState.publicationTarget}
            name="publicationTarget"
            onChange={onChangeFormState as SelectFieldChange}
            selectItems={publicationTargetForSelect}
          />
          <CheckBoxFiled
            label="参加には承認が必要"
            name="requiredApproval"
            checked={formState.requiredApproval}
            onChange={onChangeFormState}
          />
          <CircularButton onClick={onCompletion} size="lg" bgColor="main" className='self-end'>
            設定完了
          </CircularButton>
        </div>
      </div>
    </FormContainer>
  )
}

export default SpaceSetting;
