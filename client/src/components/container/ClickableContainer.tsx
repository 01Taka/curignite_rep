import React from 'react';
import { Box, Button } from '@mui/material';

interface ClickableContainerProps {
  onClick: () => void;
  children: React.ReactNode;
  sx?: object;  // MUIのカスタムスタイルを適用
  fullWidth?: boolean;
  borderRadius?: number;
}

// 子コンポーネントをボタンとして機能させるClickableContainerコンポーネント
const ClickableContainer: React.FC<ClickableContainerProps> = ({
  onClick,
  children,
  sx = {},
  fullWidth = false,
  borderRadius = 2
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        padding: 0,
        borderRadius,
        textAlign: 'inherit',
        justifyContent: 'inherit',
        color: 'inherit',
        width: fullWidth ? '100%' : 'auto',
        ...sx,  // 外部から受け取ったsxで上書き
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',  // ボタンホバー時の背景色を指定
        },
      }}
    >
      <Box width="100%" height="100%">
        {children}
      </Box>
    </Button>
  );
};

export default ClickableContainer;
