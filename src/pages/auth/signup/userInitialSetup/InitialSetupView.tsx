import React from 'react';
import FormContainer from '../../../../components/container/FormContainer';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { UserNameField } from '../../../../components/input/inputIndex';
import Heading from '../../../../components/container/Heading';
import BirthdayFiled from '../../../../components/input/field/BirthdayFiled';

export interface InitialSetupFormState {
  username: string;
  birthday: Date;
}

interface InitialSetupViewProps {
  formState: InitialSetupFormState;
  isLoading: boolean;
  submitDisabled: boolean;
  error: string;
  onFormStateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBirthdayChange: (value: Date | null) => void;
  onSetUserData: () => void;
}

const LoadingComponent: React.FC = () => (
  <Box>
    <div className='my-64'>
      <CircularProgress />
    </div>
  </Box>
);

const SubmitButton: React.FC<{ submitDisabled: boolean }> = ({ submitDisabled }) => (
  <div className='my-16'>
    <Button
      type='submit'
      size="large"
      variant="contained"
      disabled={submitDisabled}
      className='w-full'
      children="完了"
    />
  </div>
);

const InitialSetupView: React.FC<InitialSetupViewProps> = ({
  isLoading,
  formState,
  submitDisabled,
  error,
  onFormStateChange,
  onBirthdayChange,
  onSetUserData,
}) => {
  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    onSetUserData();
  };

  return (
    <FormContainer>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <Heading children='初期設定' level={1} className='mt-16'/>
          <form className='w-64 mt-12' onSubmit={handleSubmit}>
            <UserNameField
              username={formState.username}
              onUserNameChange={onFormStateChange}
            />
            <BirthdayFiled 
              value={formState.birthday}
              onChange={onBirthdayChange}
            />
            <SubmitButton submitDisabled={submitDisabled} />
          </form>
          {error && <Alert severity='error'>{error}</Alert>}
        </>
      )}
    </FormContainer>
  );
};

export default InitialSetupView;
