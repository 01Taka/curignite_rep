import React from 'react';
import FormContainer from '../../../../components/container/FormContainer';
import { Box, Button, CircularProgress } from '@mui/material';
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
        <Box>
          <div className='my-64'>
            <CircularProgress />
          </div>
        </Box>
      ) : (
        <>
          <Heading children='初期設定' level={1} className='mt-16'/>
          <form className='w-64 mt-12' onSubmit={handleSubmit}>
            <div>
              <Heading children='ユーザー' level={2} className='mb-2' />
              <UserNameField username={username} onUserNameChange={onUserNameChange} />
              <div className='flex justify-between'>
                <NumberField 
                  value={grade}
                  label='Grade'
                  min={1}
                  max={6}
                  onValueChange={onGradeChange}
                />
                <NumberField 
                  value={classNumber}
                  label='Class'
                  min={1}
                  max={16}
                  onValueChange={onClassNumberChange}
                />
              </div>
            </div>
            <div className='mt-12'>
              <Heading children='学校' level={2} className='mb-2'/>
              <StringField 
                text={schoolName}
                label='School Name'
                onTextChange={onSchoolNameChange}
              />
              <PasswordField
                password={schoolPassword}
                label='School Password'
                onPasswordChange={onSchoolPasswordChange}
              />
            </div>
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
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </FormContainer>
  );
};

export default UserInitialSetupView;
