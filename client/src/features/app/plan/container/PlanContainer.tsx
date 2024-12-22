import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { commonStyles } from '../../../../styles/mui/commonStyles';
import useTasks from '../../../hooks/app/useTasks';
import DaySelectButtonForProblemSet from './button/DaySelectButtonForProblemSet';
import SubjectIcon from '../../../../components/util/SubjectIcon';
import { Add, ImportContacts, Task } from '@mui/icons-material';
import DaySelectButton from './button/DaySelectButton';
import { PlanTarget } from '../shared/types/plan/planTargetTypes';
import TaskOverview from './TaskOverview';
import WorkOnPlanDisplay from './WorkOnPlanDisplay';
import { CategoryActivityStatus, TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { ProblemSetCategoryRead, ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';
import { WorkOnPlan, WorkOnProblemSet } from '../shared/types/plan/workOnPlanTypes';

type PlanContainerProps = {
  planTarget: PlanTarget;
  workOnProblemSet: WorkOnProblemSet | null;
  addWorkOnProblemSetTask: (problemSet: ProblemSetRead, task: TaskData, workOnNumber: number) => void;
  addIndividualPlan: (task: TaskData, progress: number | null) => void;
  getWorkOnTasks: (planTarget: PlanTarget) => WorkOnPlan[];
  onSelectProblemSetWorkOnItems: (target: ProblemSetRead, activityStatus: CategoryActivityStatus[]) => void;
  addWorkOnProblemSet: (problemSet: ProblemSetRead, categories: ProblemSetCategoryRead[], workOnNumber: number) => void;
}

const PlanContainer: React.FC<PlanContainerProps> = ({
  planTarget,
  workOnProblemSet,
  addWorkOnProblemSetTask,
  addIndividualPlan,
  getWorkOnTasks,
  onSelectProblemSetWorkOnItems,
  addWorkOnProblemSet
}) => {
  const { isIndividual, target } = planTarget;
  const { getProblemSetData } = useTasks();
  const title = isIndividual ? target.title : target.name;
  const tasks = isIndividual ? [] : getProblemSetData(target.docId).tasks;

  return (
    <Box sx={{ ...commonStyles.cardShadow, width: "95%" }}>
      <Box sx={{ ...commonStyles.flexStart, gap: 1 }}>
        <SubjectIcon subject={target.subject} size="small" />
        {isIndividual ? <Task /> : <ImportContacts />}
        <Typography>
          {title}
        </Typography>
        {!isIndividual &&
          <IconButton
            size="small"
            sx={{ color: "blue", borderRadius: 2, p: 0.3, ml: "auto" }}
            onClick={() => addWorkOnProblemSet(target, getProblemSetData(target.docId).categories, 0)}
          >
            <Add />
          </IconButton>
        }
      </Box>
      <Box sx={{ ...commonStyles.flexStart, gap: 0.5, bgcolor: "whitesmoke", padding: 0.5, mt: 1, borderRadius: 0.5 }}>
        <Typography sx={{ mr: 1 }}>
          提出: 
        </Typography>
          {isIndividual ? (
            <Box sx={{ ...commonStyles.flexStart, gap: 1.5 }}>
              <DaySelectButton
                task={target}
                emergencyDaysBorder={7}
                onSelectedDay={() => addIndividualPlan(target, null)}
              />
              <TaskOverview task={target} />
            </Box>
          ) : (
            <DaySelectButtonForProblemSet
              tasks={tasks}
              emergencyDaysBorder={7}
              displayNumber={5}
              onSelectedDay={(task) => addWorkOnProblemSetTask(target, task, 0)}
            />
          )}
        </Box>
        
        {workOnProblemSet &&
          <WorkOnPlanDisplay
          workOnPlan={workOnProblemSet}
          isIndividual={isIndividual}
          onAddWorkOnPlan={(value) =>
            addWorkOnProblemSet(workOnProblemSet.problemSet, getProblemSetData(workOnProblemSet.problemSet.docId).categories, value)
          }
          onSelectProblemSetWorkOnItems={() => {}}
        />
        }
        {getWorkOnTasks(planTarget).map(plan => (
          <WorkOnPlanDisplay
            workOnPlan={plan}
            isIndividual={isIndividual}
            onAddWorkOnPlan={(value) => {
              if (isIndividual) {
                return addIndividualPlan(target, value / 100);
              } else if (plan.planType === "problemSetTask") {
                return addWorkOnProblemSetTask(target, plan.task, value);
              }
            }}            
            onSelectProblemSetWorkOnItems={isIndividual ?
              () => {}
              : () => onSelectProblemSetWorkOnItems(target, plan.task?.problemSetActivityField?.activityStatus ?? [])
            }
          />
        ))}
    </Box>
  );
};

export default PlanContainer;