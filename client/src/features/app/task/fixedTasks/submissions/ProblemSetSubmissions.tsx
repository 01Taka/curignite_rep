import React, { useRef, useState } from 'react';
import { Box, Fab, Zoom } from '@mui/material';
import ProblemSetSubmissionContainer from './ProblemSetSubmissionContainer';
import useEventListener from '../../../../hooks/useEventListener';
import { Add } from '@mui/icons-material';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';

interface ProblemSetSubmissionsProps {
  activities: TaskData[];
  onCreateSubmission: () => void;
}

const ProblemSetSubmissions: React.FC<ProblemSetSubmissionsProps> = ({ activities, onCreateSubmission }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFabVisible, setIsFabVisible] = useState(true);

  // スクロール時に発火するコールバック関数
  const handleScroll = () => {
    if (containerRef.current) {
      const isScrolled = containerRef.current.scrollTop < 100;
      setIsFabVisible(isScrolled);
    }
  };

  // カスタムフックを使用してスクロールイベントを監視
  useEventListener(containerRef, 'scroll', handleScroll);

  const onWorkOn = (task: TaskData) => {

  }

  return (
    <>
      <Box ref={containerRef} sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        borderRadius: 2,
        gap: '0.2rem',
        overflowY: 'auto', // スクロールを垂直方向に限定
        padding: 1,
        height: '90vh'
      }}>
        {activities.map((activity, index) => (
          <Box key={index}>
            <ProblemSetSubmissionContainer activity={activity} onClickWorkOn={() => onWorkOn(activity)}/>
          </Box>
        ))}
        <Box minHeight={200}/>
      </Box>
      <Zoom in={isFabVisible}>
        <Fab
          size='medium'
          color="primary"
          sx={{
            position: 'fixed',
            right: 12,
            bottom: 32,
          }}
          onClick={onCreateSubmission}
        >
          <Add />
        </Fab>
      </Zoom>
    </>
  );
};

export default ProblemSetSubmissions;
