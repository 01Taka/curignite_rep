import React, { FC, useRef, useState, useEffect } from 'react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FocusLearningTimer from './FocusLearningTimer';
import { Box, IconButton, keyframes } from '@mui/material';
import { exitFullScreen, requestFullScreen } from '../../../functions/screen/fullScreen';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mainPaths } from '../../../types/path/mainPaths';
import { rootPaths } from '../../../types/path/paths';

interface FocusLearningProps {}

const FocusLearning: FC<FocusLearningProps> = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null); // useRef に型を追加
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleBackHome = () => {
    navigate(rootPaths.main);
  }

  const handleToggleMode = () => {
    if (isFullscreen) {
      exitFullScreen();
    } else if (ref.current) {
      requestFullScreen(ref.current);
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (document.fullscreenElement === ref.current) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const gradientAnimation = keyframes`
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  `;

  return (
    <Box
    ref={ref}
    sx={{
      background: "linear-gradient(45deg, #7b6dfc, #8a99ff)",
      backgroundSize: '200% 200%',
      animation: `${gradientAnimation} 8s ease infinite`,
    }}
    className="relative flex justify-center items-center w-screen h-screen"
    >
      <FocusLearningTimer />

      <div className='absolute top-4 right-4'>
        <IconButton onClick={handleToggleMode} size="large">
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </div>
      <div className='absolute top-4 left-4' onClick={handleBackHome}>
        <IconButton>
          <Home />
        </IconButton>
      </div>
    </Box>
  );
};

export default FocusLearning;
