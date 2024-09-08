import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton, Alert } from '@mui/material';
import { Add, Delete as DeleteIcon } from '@mui/icons-material';
import { FormStateChangeEvent, FormStateChangeFunc, HTMLFilesElement } from '../../../types/util/componentsTypes';

interface FileUploadFieldProps {
  label: string;
  name: string;
  value: File[];
  maxHeight?: number;
  maxFiles?: number;
  acceptedFileTypes?: string;
  onChange: FormStateChangeFunc;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, name, value, maxHeight, maxFiles = 10, acceptedFileTypes, onChange }) => {
  const [fileNumber, setFileNumber] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setFileNumber(value.length);
  }, [value])
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    const newFiles = fileList ? Array.from(fileList) : [];

    setError("");

    // 現在のファイル数と新しく追加するファイル数の合計がmaxFilesを超えないようにする
    if (value.length + newFiles.length > maxFiles) {
      setError(`アップロードできるファイルは最大${maxFiles}ファイルまでです。`);
      return;
    }

    const event: FormStateChangeEvent = {
      target: {
        name,
        value: [...value, ...newFiles],
        type: 'file',
      },
    } as unknown as React.ChangeEvent<HTMLFilesElement>;
    onChange(event);
  };

  const handleFileRemove = (indexToRemove: number) => {
    const newFiles = value.filter((_, index) => index !== indexToRemove);

    const event: FormStateChangeEvent = {
      target: {
        name,
        value: newFiles,
        type: 'file',
      },
    } as unknown as React.ChangeEvent<HTMLFilesElement>;
    onChange(event);
  };

  return (
    <Box className="flex flex-col gap-2 bg-gray-200 p-4 rounded-lg">
      <Box className="flex justify-between items-center">
        <Typography variant="h6">
          {label}
        </Typography>
        {maxFiles !== Infinity &&
          <Typography>
            {fileNumber}/{maxFiles}
          </Typography>
        }
      </Box>
      {error && <Alert severity="error" >{error}</Alert>}
      <Button
        variant="contained"
        component="label"
        disabled={value.length >= maxFiles} // 上限に達している場合ボタンを無効化
      >
        ファイルを追加
        <Add />
        <input
          type="file"
          name={name}
          multiple
          hidden
          accept={acceptedFileTypes} // ここでファイルタイプを制限
          onChange={handleFileChange}
        />
      </Button>
      {value.length > 0 && (
        <Box className="overflow-y-auto" sx={{ maxHeight }}>
          {value.map((file, index) => (
            <Box key={index} display="flex" alignItems="center" gap={2} mt={2}>
              {file.type.startsWith('image/') ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                  />
                  <Typography>{file.name}</Typography>
                </Box>
              ) : (
                <Typography>{file.name}</Typography>
              )}
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleFileRemove(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FileUploadField;
