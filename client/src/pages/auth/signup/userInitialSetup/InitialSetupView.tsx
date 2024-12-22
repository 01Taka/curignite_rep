import React from 'react';
import FormContainer from '../../../../components/container/FormContainer';
import { Alert, Box, CircularProgress } from '@mui/material';
import { UserNameField } from '../../../../components/input/inputIndex';
import Heading from '../../../../components/container/Heading';
import CircularButton from '../../../../components/input/button/CircularButton';
import DateField from '../../../../components/input/field/DateField';
import ImageUploadField from '../../../../components/input/field/ImageUploadField';
import { keyMirror } from '../../../../functions/utils/dataStructureUtils/objectUtils';
import { FormStateChangeAction } from '../../../../types/app/formStateTypes';

export interface InitialSetupFormState {
  username: string;
  birthday: Date | null;
  iconFile: File | null;
}

interface InitialSetupViewProps {
  formState: InitialSetupFormState;
  isLoading: boolean;
  submitDisabled: boolean;
  error: string;
  onChangeFormState: (action: FormStateChangeAction) => void;
  onSubmit: () => void;
}

const LoadingComponent: React.FC = () => (
  <Box className='my-64'>
    <CircularProgress />
  </Box>
);

const InitialSetupView: React.FC<InitialSetupViewProps> = ({
  isLoading,
  formState,
  submitDisabled,
  error,
  onChangeFormState,
  onSubmit,
}) => {
  const names = keyMirror(formState);
  return (
    <FormContainer flexCenter>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <Heading children='初期設定' level={1} className='mt-16' />
          <form className='flex flex-col w-80 space-y-6 mt-12' onSubmit={e => { e.preventDefault(); onSubmit(); }}>
            <UserNameField
              username={formState.username}
              onUserNameChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })}
            />
            <DateField
              label="生年月日"
              value={formState.birthday}
              name={names.birthday}
              onChangeFormState={onChangeFormState}
            />
            <ImageUploadField
              label='アイコン'
              value={formState.iconFile}
              name={names.iconFile}
              onChangeFormState={onChangeFormState}
              
            />
            <CircularButton
              type='submit'
              size="lg"
              bgColor="main"
              invalidation={submitDisabled}
              className='self-end'
            >
              完了
            </CircularButton>
          </form>
          {error && <Alert severity='error'>{error}</Alert>}
        </>
      )}
    </FormContainer>
  );
};

export default InitialSetupView;
