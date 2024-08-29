import React, { FC, useState } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { FormStateChangeEvent, FormStateChangeFunc, HTMLFileElement } from '../../../types/util/componentsTypes';
import { cva } from 'class-variance-authority';
import { cn } from '../../../functions/utils';
import { Edit } from '@mui/icons-material';

interface ImageUploadFieldProps {
  name: string;
  label: string;
  value: File | null;
  onChange: FormStateChangeFunc;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  borderStyle?: 'none' | 'solid' | 'dashed';
}

const imageVariants = cva('flex justify-center items-center mx-auto', {
  variants: {
    size: {
      sm: 'h-12 w-12',
      md: 'h-24 w-24',
      lg: 'h-48 w-48',
    },
    shape: {
      circle: 'rounded-full',
      square: 'rounded',
    },
    borderStyle: {
      none: '',
      solid: 'border border-solid border-gray-500',
      dashed: 'border border-dashed border-gray-500',
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'square',
    borderStyle: 'none',
  },
});

const ImageUploadField: FC<ImageUploadFieldProps> = ({
  name,
  label,
  value,
  onChange,
  size = 'md',
  shape = 'square',
  borderStyle = 'none',
}) => {
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      const event: FormStateChangeEvent = {
        target: {
          name,
          value: file,
          type: 'url',
        },
      } as unknown as React.ChangeEvent<HTMLFileElement>;
      onChange(event);
    }
  };

  return (
    <div className="flex relative p-2 bg-gray-300 rounded-md">
      <div className={cn("absolute left-4", value ? "top-1" : "top-3")}>
        <Typography variant={value ? "caption" : "body1"} color="GrayText">{label}</Typography>
      </div>

      <label htmlFor={`${name}-image-upload`} className="cursor-pointer w-full">
        <div className={cn(imageVariants({ size, shape, borderStyle }))}>
          {value ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <img
                src={imageUrl}
                alt="Uploaded Preview"
                className="flex justify-center items-center"
              />
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              画像を選択
            </Typography>
          )}
        </div>
      </label>

      <input
        accept="image/*"
        id={`${name}-image-upload`}
        type="file"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      <div className="absolute top-1 right-1">
        <label htmlFor={`${name}-image-upload`} className="cursor-pointer">
          <IconButton component="span">
            <Edit />
          </IconButton>
        </label>
      </div>
    </div>
  );
};

export default ImageUploadField;
