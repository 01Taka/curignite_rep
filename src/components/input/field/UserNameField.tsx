import React from 'react'
import { TextField } from '@mui/material';

interface UserNameFieldProps {
    username: string;
    onUserNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserNameField: React.FC<UserNameFieldProps> = ({
    username,
    onUserNameChange,
}) => {
  return (
    <TextField
        className='w-full h-14'
        id="username"
        name="username"
        label="UserName"
        variant="standard"
        type="text"
        value={username}
        onChange={onUserNameChange}
    />
  )
}

export default UserNameField