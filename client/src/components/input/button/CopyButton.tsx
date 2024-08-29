import React, { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FileCopy, CheckCircle } from '@mui/icons-material';

interface CopyButtonProps {
  textToCopy: string;
  tooltipMessage?: string;
}

const CopyButton: FC<CopyButtonProps> = ({ textToCopy, tooltipMessage = 'テキストをコピー' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒後にコピー状態をリセット
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div>
      <Tooltip title={copied ? 'コピーしました！' : tooltipMessage} placement="top" arrow>
        <IconButton onClick={handleCopy}>
          {copied ? <CheckCircle className='text-green-500'/> : <FileCopy className='text-gray-500' />}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default CopyButton;
