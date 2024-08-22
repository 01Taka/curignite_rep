import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material'
import React, { FC, ReactNode } from 'react'

interface CheckBoxFieldProps extends CheckboxProps {
    label: ReactNode;
    disabled?: boolean;
    required?: boolean;
}

const CheckBoxField: FC<CheckBoxFieldProps> = ({ label, disabled, required, ...props }) => {
  return (
    <FormControlLabel disabled={disabled} required={required} control={<Checkbox {...props}/>} label={label} />
  )
}

export default CheckBoxField