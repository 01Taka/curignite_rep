import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProblemSetStructure, TaskData } from '../../../types/firebase/db/task/taskExpansionTypes';
import { IndividualTaskRead, ProblemSetActivityRead, ProblemSetCategoryRead, ProblemSetRead } from '../../../types/firebase/db/task/taskStructure';

export interface TaskSliceState {
  tasks: TaskData[];
  individualTaskMap: Record<string, IndividualTaskRead>;
  activityMap: Record<string, ProblemSetActivityRead>;
  categoryMap: Record<string, ProblemSetCategoryRead>;
  problemSetMap: Record<string, ProblemSetRead>;
  problemSetStructureMap: Record<string, ProblemSetStructure>;
}

const initialState: TaskSliceState = {
  tasks: [],
  individualTaskMap: {},
  activityMap: {},
  categoryMap: {},
  problemSetMap: {},
  problemSetStructureMap: {}
};

const taskSlice = createSlice({
  name: 'taskSlice',
  initialState,
  reducers: {
    setTaskSliceState: (_, action: PayloadAction<TaskSliceState>) => {
      return action.payload;
    },
    setTasks: (state, action: PayloadAction<TaskData[]>) => {
      state.tasks = action.payload;
    },
    setIndividualTasks: (state, action: PayloadAction<Record<string, IndividualTaskRead>>) => {
      state.individualTaskMap = action.payload;
    },
    setActivityMap: (state, action: PayloadAction<Record<string, ProblemSetActivityRead>>) => {
      state.activityMap = action.payload;
    },
    setCategoryMap: (state, action: PayloadAction<Record<string, ProblemSetCategoryRead>>) => {
      state.categoryMap = action.payload;
    },
    setProblemSetMap: (state, action: PayloadAction<Record<string, ProblemSetRead>>) => {
      state.problemSetMap = action.payload;
    },
  },
});

export const { setTaskSliceState, setTasks, setIndividualTasks, setActivityMap, setCategoryMap, setProblemSetMap } = taskSlice.actions;
export default taskSlice.reducer;