import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskData } from '../../../types/firebase/db/task/taskExpansionTypes';
import { IndividualTaskRead, ProblemSetActivityRead, ProblemSetCategoryRead, ProblemSetRead } from '../../../types/firebase/db/task/taskStructure';

interface TaskSliceState {
  tasks: TaskData[];
  individualTasks: IndividualTaskRead[];
  activityMap: Record<string, ProblemSetActivityRead>;
  categoryMap: Record<string, ProblemSetCategoryRead>;
  problemSetMap: Record<string, ProblemSetRead>;
  problemSetStructures: {
    problemSetId: string;
    categories: ProblemSetCategoryRead[];
    activities: ProblemSetActivityRead[];
  }[]
}

const initialState: TaskSliceState = {
  tasks: [],
  individualTasks: [],
  activityMap: {},
  categoryMap: {},
  problemSetMap: {},
  problemSetStructures: []
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
    setIndividualTasks: (state, action: PayloadAction<IndividualTaskRead[]>) => {
      state.individualTasks = action.payload;
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