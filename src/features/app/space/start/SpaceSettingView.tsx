import React, { FC, useEffect, useState } from 'react';
import { SpaceSettingViewProps } from '../../../../types/app/spaceTypes';
import { SelectFieldChange } from '../../../../types/util/componentsTypes';
import EditNoteIcon from '@mui/icons-material/EditNote';
import StringField from '../../../../components/input/field/StringField';
import MultilineField from '../../../../components/input/field/MultilineField';
import CheckBoxFiled from '../../../../components/input/field/CheckBoxFiled';
import CircularButton from '../../../../components/input/button/CircularButton';
import SelectField from '../../../../components/input/field/SelectFiled';
import FormContainer from '../../../../components/container/FormContainer';
import { Alert, Typography } from '@mui/material';
import { publicationTargetForSelect } from '../../../../types/firebase/db/space/spacesTypes';

const SpaceSettingView: FC<SpaceSettingViewProps> = ({ formState, onChangeFormState, onCompletion, onUpdateDefaultSetting }) => {
  const [updatedDefaultSetting, setUpdatedDefaultSetting] = useState(false);

  useEffect(() => {
    setUpdatedDefaultSetting(false);
  }, [formState])

  const handleUpdateDefaultSetting = () => {
    onUpdateDefaultSetting();
    setUpdatedDefaultSetting(true);
  }

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
            value={formState.description}
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
          <div className='flex self-end space-x-4'>
            <CircularButton onClick={handleUpdateDefaultSetting} size="lg" looks="frame">
              デフォルト<br/>に設定
            </CircularButton>
            <CircularButton onClick={onCompletion} size="lg" bgColor="main">
              完了して<br/>開始
            </CircularButton>
          </div>
          {updatedDefaultSetting && 
            <Alert severity="success">現在の設定をデフォルトに設定しました。</Alert>
          }
        </div>
      </div>
    </FormContainer>
  );
}

export default SpaceSettingView;
