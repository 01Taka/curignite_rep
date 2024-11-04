import { motion } from 'framer-motion';
import { Box, Button, Typography, Paper, Card, Stack, Grid } from '@mui/material';
import { FC, forwardRef } from 'react';
import { BoxProps, ButtonProps, TypographyProps, PaperProps, CardProps, StackProps, GridProps } from '@mui/material';

// 各コンポーネントをforwardRefでラップして、Framer Motionのmotionでラップ
export const MotionBox = motion(
  forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
    <Box ref={ref} {...props} />
  ))
);

export const MotionButton = motion(
  forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <Button ref={ref} {...props} />
  ))
);

export const MotionTypography = motion(
  forwardRef<HTMLSpanElement, TypographyProps>((props, ref) => (
    <Typography ref={ref} {...props} />
  ))
);

export const MotionPaper = motion(
  forwardRef<HTMLDivElement, PaperProps>((props, ref) => (
    <Paper ref={ref} {...props} />
  ))
);

export const MotionCard = motion(
  forwardRef<HTMLDivElement, CardProps>((props, ref) => (
    <Card ref={ref} {...props} />
  ))
);

export const MotionStack = motion(
  forwardRef<HTMLDivElement, StackProps>((props, ref) => (
    <Stack ref={ref} {...props} />
  ))
);

export const MotionGrid = motion(
  forwardRef<HTMLDivElement, GridProps>((props, ref) => (
    <Grid ref={ref} {...props} />
  ))
);
