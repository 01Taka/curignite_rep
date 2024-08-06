import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material'
import React, { FC, ReactNode } from 'react'

interface CheckBoxFiledProps extends CheckboxProps {
    label: ReactNode;
    disabled?: boolean;
    required?: boolean;
}

const CheckBoxFiled: FC<CheckBoxFiledProps> = ({ label, disabled, required, ...props }) => {
  return (
    <FormControlLabel disabled={disabled} required={required} control={<Checkbox {...props}/>} label={label} />
  )
}

export default CheckBoxFiled