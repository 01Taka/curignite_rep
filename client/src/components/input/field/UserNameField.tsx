import React from 'react'
import StringField from './StringField';

interface UserNameFieldProps {
    username: string;
    onUserNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserNameField: React.FC<UserNameFieldProps> = ({
    username,
    onUserNameChange,
}) => {
  return (
    <StringField 
      id="username"
      name="username"
      label="UserName"
      value={username}
      type="text"
      onChange={onUserNameChange}
    />
  )
}

export default UserNameField