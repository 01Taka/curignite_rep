import React from 'react';
import FormContainer from '../../../../components/container/FormContainer';
import { Alert, Box, CircularProgress } from '@mui/material';
import { UserNameField } from '../../../../components/input/inputIndex';
import Heading from '../../../../components/container/Heading';
import CircularButton from '../../../../components/input/button/CircularButton';
import { FormStateChangeFunc } from '../../../../types/util/componentsTypes';
import DateField from '../../../../components/input/field/DateField';
import ImageUploadField from '../../../../components/input/field/ImageUploadField';
import { keyMirror } from '../../../../functions/objectUtils';

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
  onFormStateChange: FormStateChangeFunc;
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
  onFormStateChange,
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
              onUserNameChange={onFormStateChange}
            />
            <DateField
              label="生年月日"
              value={formState.birthday}
              name={names.birthday}
              onChange={onFormStateChange}
            />
            <ImageUploadField
              label='アイコン'
              value={formState.iconFile}
              name={names.iconFile}
              onChange={onFormStateChange}
              
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
