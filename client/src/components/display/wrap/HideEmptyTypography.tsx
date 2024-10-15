import { SxProps, Typography, TypographyProps } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import React, { ReactNode } from 'react';

interface HideEmptyTypographyProps extends Omit<TypographyProps, 'children' | 'variant'> {
  children: ReactNode | undefined | null;
  variant?: Variant;
  sx?: SxProps;
}

const isEmpty = (child: ReactNode) =>
  child === null ||
  child === undefined ||
  (typeof child === 'string' && child.trim() === '');

const HideEmptyTypography: React.FC<HideEmptyTypographyProps> = ({ children, variant = 'body1', sx = {}, ...props }) => {
  if (isEmpty(children)) {
    return null;
  }

  return (
    <Typography variant={variant} sx={sx} {...props}>
      {children}
    </Typography>
  );
};

export default React.memo(HideEmptyTypography, (prevProps, nextProps) => {
  return (
    prevProps.children === nextProps.children &&
    prevProps.variant === nextProps.variant &&
    prevProps.sx === nextProps.sx
  );
});
