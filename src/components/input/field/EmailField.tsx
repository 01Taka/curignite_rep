import React from 'react'
import StringField from './StringField';

interface EmailFieldProps {
    email: string;
    onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({
    email,
    onEmailChange,
}) => {
  return (
    <StringField 
      id="email"
      name="email"
      label="Email"
      type="email"
      value={email}
      onChange={onEmailChange}
    />
  )
}

export default EmailField