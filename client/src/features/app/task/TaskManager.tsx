import React, { useState, useRef } from 'react';
import { Box, Fab, Zoom } from '@mui/material';
import Tasks from './tasks/Tasks';
import ProblemSets from './problemSets/ProblemSets';
import { Add } from '@mui/icons-material';
import usePulseOnChange from '../../hooks/usePulseOnChange';
import Popup from '../../../components/display/popup/Popup';
import CreateIndividualTask from './createTask/createIndividualTask/CreateIndividualTask';
import useEventListener from '../../hooks/useEventListener';
import CreateProblemSet from './createTask/createProblemSet/CreateProblemSet';
import useLocationTab from '../../hooks/navigate/useLocationTab';
import useDefaultNavigation from '../../hooks/navigate/useDefaultNavigation';
import useSwitchComponents from '../../hooks/components/useSwitchComponents';
import { appPaths } from '../../../constants/app/path/appPath';
import { getPathList } from '../../../functions/utils/pathUtils';

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useDefaultNavigation(appPaths.task.list._abs, getPathList(appPaths.task, { includeRoot: false }));

  const { RouteElement, TabsElement, selectedItem } = useLocationTab([
    { id: "list", label: "タスク一覧", path: appPaths.task.list, element: <Tasks /> },
    { id: "problemSet", label: "問題集", path: appPaths.task.problemSets, element: <ProblemSets /> }
  ], { navigateOptions: { replace: true }});

  const { Component, isUsingDefaultComponent, switchToDefault, switchComponent } = useSwitchComponents([
    { id: "createIndividual", Component: <CreateIndividualTask /> },
    { id: "createProblemSet", Component: <CreateProblemSet /> }
  ])

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
        {RouteElement}
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
