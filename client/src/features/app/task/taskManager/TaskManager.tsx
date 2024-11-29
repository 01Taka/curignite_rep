import React, { useState, useRef } from 'react';
import { Box, Tabs, Tab, Fab, Zoom } from '@mui/material';
import Tasks from '../tasks/Tasks';
import ProblemSets from '../problemSets/ProblemSets';
import { Add } from '@mui/icons-material';
import usePulseOnChange from '../../../hooks/usePulseOnChange';
import Popup from '../../../../components/display/popup/Popup';
import CreateIndividualTask from '../createTask/createIndividualTask/CreateIndividualTask';
import useEventListener from '../../../hooks/useEventListener';
import CreateProblemSet from '../createTask/createProblemSet/CreateProblemSet';

interface TaskManagerProps {}

interface CreateTaskProps {
  isFabVisible: boolean;
  selectedTab: number;
  onFabClick: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ isFabVisible, selectedTab, onFabClick }) => {
  const hasChanged = usePulseOnChange(selectedTab);

  return (
    <Box>
      <Zoom in={isFabVisible && !hasChanged}>
        <Fab
          size='medium'
          color={selectedTab === 0 ? "primary" : "secondary"}
          sx={{
            position: 'fixed',
            right: 12,
            bottom: 12,
          }}
          onClick={onFabClick}
        >
          <Add />
        </Fab>
      </Zoom>
    </Box>
  );
};

const TaskManager: React.FC<TaskManagerProps> = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedForm, setSelectedForm] = useState<number | null>(null);
  const [isFabVisible, setIsFabVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const isScrolled = containerRef.current.scrollTop < 100;
      setIsFabVisible(isScrolled);
    }
  };

  useEventListener(containerRef, 'scroll', handleScroll);


  const handleFabClick = () => {
    setSelectedForm(selectedTab);
  }

  return (
    <>
      <Box sx={{ width: '100%', height: '100vh', overflow: 'auto' }} ref={containerRef}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="タスク一覧" />
          <Tab label="固定タスク" />
        </Tabs>
        <CreateTask isFabVisible={isFabVisible} selectedTab={selectedTab} onFabClick={handleFabClick} />
        <Box>
          {selectedTab === 0 && <Tasks />}
          {selectedTab === 1 && <ProblemSets />}
        </Box>
        <Box height={200} />
      </Box>
      <Popup open={selectedForm !== null} handleClose={() => setSelectedForm(null)} >
        {selectedForm === 0 && <CreateIndividualTask />}
        {selectedForm === 1 && <CreateProblemSet />}
      </Popup>
    </>
  );
};

export default TaskManager;
