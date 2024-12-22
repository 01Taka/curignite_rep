// import React from 'react';
// import MissionContainer from '../plan/container/PlanContainer';
// import useTasks from '../../hooks/app/useTasks';
// import { Box } from '@mui/material';
// import { commonStyles } from '../../../styles/mui/commonStyles';

// interface MissionProps { }

// const Mission: React.FC<MissionProps> = () => {
//   const { taskMap, individualTasks, problemSets } = useTasks();

//   return (
//     <Box sx={{ ...commonStyles.flexColumnCenter, gap: 2, width: "100%" }}>
//       {individualTasks.map(target => (
//         <MissionContainer missionTarget={{ isIndividual: true, target: taskMap[target.docId] }} emergencyDaysBorder={7} />
//       ))}
//       {problemSets.map(target => (
//         <MissionContainer missionTarget={{ isIndividual: false, target }} emergencyDaysBorder={7} />
//       ))}
//     </Box>
//   );
// };

// export default Mission;

export {}