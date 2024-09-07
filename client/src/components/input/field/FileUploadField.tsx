import React, { ChangeEvent } from 'react';
import { TextField, Box, Button, Typography } from '@mui/material';
import { FormStateChangeEvent, FormStateChangeFunc, HTMLFilesElement } from '../../../types/util/componentsTypes';

interface FileUploadFieldProps {
  label: string;
  name: string;
  value: File[];
  onChange: FormStateChangeFunc;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, name, value, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    const value = fileList ? Array.from(fileList) : [];

    const event: FormStateChangeEvent = {
      target: {
        name,
        value,
        type: 'date',
      },
    } as unknown as React.ChangeEvent<HTMLFilesElement>;
    onChange(event);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">{label}</Typography>
      <Button
        variant="contained"
        component="label"
      >
        ファイルを選択
        <input
          type="file"
          name={name}
          multiple
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {value.length > 0 && (
        <Box>
          {value.map((file, index) => (
            <Typography key={index}>{file.name}</Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FileUploadField;
