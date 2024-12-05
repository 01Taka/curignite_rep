import React, { useState, useRef } from 'react';
import { Box, Fab, Zoom } from '@mui/material';
import { Add } from '@mui/icons-material';
import usePulseOnChange from '../../hooks/usePulseOnChange';
import Popup from '../../../components/display/popup/Popup';
import CreateIndividualTask from './createTask/createIndividualTask/CreateIndividualTask';
import useEventListener from '../../hooks/useEventListener';
import CreateProblemSet from './createTask/createProblemSet/CreateProblemSet';
import useSwitchComponents from '../../hooks/components/useSwitchComponents';
import { appPaths } from '../../../constants/app/path/appPath';
import { Outlet } from 'react-router-dom';
import useNavigationTab from '../../hooks/navigate/useNavigationTab';

interface TaskManagerProps {}

interface CreateTaskProps {
  isFabVisible: boolean;
  isIndividual: boolean;
  onFabClick: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ isFabVisible, isIndividual, onFabClick }) => {
  const hasChanged = usePulseOnChange(isIndividual);

  return (
    <Box>
      <Zoom in={isFabVisible && !hasChanged}>
        <Fab
          size='medium'
          color={isIndividual ? "primary" : "secondary"}
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
  const [isFabVisible, setIsFabVisible] = useState(true);
  const [displayComponentId, setDisplayComponentId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);


  const { TabsElement, selectedItem } = useNavigationTab([
    { id: "list", label: "タスク一覧", path: appPaths.task.list },
    { id: "problemSet", label: "問題集", path: appPaths.task.problemSets }
  ], { navigateOptions: { replace: true }});

  const { Component, isUsingDefaultComponent, switchToDefault, switchComponent } = useSwitchComponents({
    components: [
      { id: "createIndividual", Component: <CreateIndividualTask onSuccessCreate={() => setDisplayComponentId(null)} /> },
      { id: "createProblemSet", Component: <CreateProblemSet onSuccessProblemSet={() => setDisplayComponentId(null)}/> }
    ],
    externalState: {
      displayComponentId,
      setDisplayComponentId
    }
  })

  const handleScroll = () => {
    if (containerRef.current) {
      const isScrolled = containerRef.current.scrollTop < 100;
      setIsFabVisible(isScrolled);
    }
  };

  useEventListener(containerRef, 'scroll', handleScroll);

  return (
    <>
      <Box sx={{ height: '100vh', overflow: "auto" }} ref={containerRef}>
        <Box sx={{ m: 1 }}>{TabsElement}</Box>
        <Outlet />
        <Box height={200} />
      </Box>
      <CreateTask
        isFabVisible={isFabVisible}
        isIndividual={selectedItem?.id === "list"}
        onFabClick={() => switchComponent(selectedItem?.id === "list" ? "createIndividual" : "createProblemSet")}
      />
      <Popup open={!isUsingDefaultComponent} handleClose={() => switchToDefault()}>
        {Component}
      </Popup>
    </>    
  )
};

export default TaskManager;
