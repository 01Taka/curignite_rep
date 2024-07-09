import React from 'react';
import FormContainer from '../../../../components/container/FormContainer';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { NumberField, PasswordField, StringField, UserNameField } from '../../../../components/input/inputIndex';
import Heading from '../../../../components/container/Heading';

interface UserInitialSetupViewProps {
  isLoading: boolean;
  username: string;
  grade: string;
  classNumber: string;
  schoolName: string;
  schoolPassword: string;
  submitDisabled: boolean;
  error: string;
  onUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGradeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClassNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSchoolNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSchoolPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetUserInfo: () => void;
}

const LoadingComponent: React.FC = () => (
  <Box>
    <div className='my-64'>
      <CircularProgress />
    </div>
  </Box>
);

const UserSection: React.FC<{
  username: string;
  grade: string;
  classNumber: string;
  onUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGradeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClassNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ username, grade, classNumber, onUserNameChange, onGradeChange, onClassNumberChange }) => (
  <div>
    <Heading children='ユーザー' level={2} className='mb-2' />
    <UserNameField username={username} onUserNameChange={onUserNameChange} />
    <div className='flex justify-between'>
      <NumberField value={grade} label='Grade' name='grade' min={1} max={6} onValueChange={onGradeChange} />
      <NumberField value={classNumber} label='Class' name='classNumber' min={1} max={16} onValueChange={onClassNumberChange} />
    </div>
  </div>
);

const SchoolSection: React.FC<{
  schoolName: string;
  schoolPassword: string;
  onSchoolNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSchoolPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ schoolName, schoolPassword, onSchoolNameChange, onSchoolPasswordChange }) => (
  <div className='mt-12'>
    <Heading children='学校' level={2} className='mb-2' />
    <StringField value={schoolName} label='School Name' name='schoolName' onChange={onSchoolNameChange} />
    <PasswordField password={schoolPassword} label='School Password' name='schoolPassword' onPasswordChange={onSchoolPasswordChange} />
  </div>
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

const UserInitialSetupView: React.FC<UserInitialSetupViewProps> = ({
  isLoading,
  username,
  grade,
  classNumber,
  schoolName,
  schoolPassword,
  submitDisabled,
  error,
  onUserNameChange,
  onGradeChange,
  onClassNumberChange,
  onSchoolNameChange,
  onSchoolPasswordChange,
  onSetUserInfo,
}) => {
  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    onSetUserInfo();
  };

  return (
    <FormContainer>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <Heading children='初期設定' level={1} className='mt-16'/>
          <form className='w-64 mt-12' onSubmit={handleSubmit}>
            <UserSection 
              username={username}
              grade={grade}
              classNumber={classNumber}
              onUserNameChange={onUserNameChange}
              onGradeChange={onGradeChange}
              onClassNumberChange={onClassNumberChange}
            />
            <SchoolSection
              schoolName={schoolName}
              schoolPassword={schoolPassword}
              onSchoolNameChange={onSchoolNameChange}
              onSchoolPasswordChange={onSchoolPasswordChange}
            />
            <SubmitButton submitDisabled={submitDisabled} />
          </form>
          {error && <Alert severity='error'>{error}</Alert>}
        </>
      )}
    </FormContainer>
  );
};

export default UserInitialSetupView;
