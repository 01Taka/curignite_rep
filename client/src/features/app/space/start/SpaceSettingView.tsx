import React, { FC, useEffect, useMemo, useState } from 'react';
import { SpaceSettingViewProps } from '../../../../types/app/space/spaceTypes';
import EditNoteIcon from '@mui/icons-material/EditNote';
import StringField from '../../../../components/input/field/StringField';
import MultilineField from '../../../../components/input/field/MultilineField';
import CheckBoxField from '../../../../components/input/field/CheckBoxField';
import CircularButton from '../../../../components/input/button/CircularButton';
import SelectField from '../../../../components/input/field/SelectField';
import FormContainer from '../../../../components/container/FormContainer';
import { Alert, CircularProgress, Typography } from '@mui/material';
import { publicationTargetForSelect } from '../../../../types/firebase/db/space/spaceStructure';
import { keyMirror } from '../../../../functions/objectUtils';

const SpaceSettingView: FC<SpaceSettingViewProps> = ({ formState, isStarting, onChangeFormState, onCompletion, onUpdateDefaultSetting }) => {
  const [updatedDefaultSetting, setUpdatedDefaultSetting] = useState(false);
  const names = useMemo(() => keyMirror(formState), [formState]);

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
            name={names.spaceName}
            value={formState.spaceName}
            onChange={onChangeFormState}
          />
          <MultilineField
            label='紹介文'
            rows={4}
            name={names.description}
            value={formState.description}
            onChange={onChangeFormState}
          />
          <SelectField
            label='公開対象'
            value={formState.publicationTarget}
            name={names.publicationTarget}
            onChange={onChangeFormState}
            selectItems={publicationTargetForSelect}
          />
          <CheckBoxField
            label="参加には承認が必要"
            name={names.requiresApproval}
            checked={formState.requiresApproval}
            onChange={onChangeFormState}
          />
          <div className='flex self-end space-x-4'>
            <CircularButton onClick={handleUpdateDefaultSetting} size="lg" looks="frame">
              デフォルト<br/>に設定
            </CircularButton>
            <CircularButton onClick={onCompletion} size="lg" bgColor="main" invalidation={isStarting}>
              {isStarting ? (
                <CircularProgress />
              ) : (
                <>完了して<br/>開始</>
              )}
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
