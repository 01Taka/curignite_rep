// import React, { FC, useEffect, useState } from 'react';
// import Popup from '../../../../components/util/Popup';
// import { NumberField, StringField } from '../../../../components/input/inputIndex';
// import { Subject } from '../../../../types/firebase/db/common/commonTypes';
// import { keyMirror } from '../../../../functions/objectUtils';
// import { handleFormStateChange } from '../../../../functions/utils';
// import { FormStateChangeEvent } from '../../../../types/util/componentsTypes';
// import SelectField from '../../../../components/input/field/SelectField';
// import { useAppSelector } from '../../../../redux/hooks';
// import { Box, Typography, Alert } from '@mui/material';
// import { subjectSelectItems } from '../../../../constants/selectItems/subjectSelectItems';
// import CircularButton from '../../../../components/input/button/CircularButton';
// import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
// import useAsyncHandler from '../../../hooks/useAsyncHandler';
// import { startLearningGoal } from '../../../../services/learning/sessionActionService';

// interface StartSessionPopupProps {
//   open: boolean;
//   handleClose: () => void;
// }

// interface CreateGoalFormState {
//   objectives: string;
//   subject: Subject;
//   targetDurationMin: number;
// }

// const StartSessionPopup: FC<StartSessionPopupProps> = ({ open, handleClose }) => {
//   const uid = useAppSelector(state => state.userSlice.uid);

//   const [formState, setFormState] = useState<CreateGoalFormState>({
//     objectives: "",
//     subject: Subject.NotSelected,
//     targetDurationMin: 30,
//   });

//   const { errorMessage, setErrorMessage, callAsyncFunction, reset } = useAsyncHandler();

//   useEffect(() => {
//     reset();
//   }, [open]);

//   const handleStartSession = () => {
//     if (uid) {
//       callAsyncFunction(
//         [uid, formState.objectives, formState.subject, formState.targetDurationMin * MINUTES_IN_MILLISECOND],
//         startLearningGoal,
//         "目標の作成中にエラーが発生しました。もう一度試してください。"
//       )
//     }
//   }

//   const formStateChangeHandler = (e: FormStateChangeEvent) => {
//     handleFormStateChange(e, setFormState);
//     // エラーメッセージのリセット
//     setErrorMessage("");
//   };

//   return (
//     <Popup open={open} handleClose={handleClose}>
//       <Box className='space-y-6 shadow-md p-4 rounded-lg'>
//         <Typography variant='h5'>
//           学習目標を設定。
//         </Typography>
//         <StringField
//           label="目標"
//           value={formState.objectives}
//           name={keyMirror(formState).objectives}
//           onChange={formStateChangeHandler}
//         />
//         <SelectField
//           label='教科'
//           value={formState.subject}
//           name={keyMirror(formState).subject}
//           selectItems={subjectSelectItems}
//           onChange={formStateChangeHandler}
//         />
//         <NumberField
//           label='目標達成時刻'
//           value={formState.targetDurationMin}
//           name={keyMirror(formState).targetDurationMin}
//           onChange={formStateChangeHandler}
//           max={180}
//         />
//       </Box>
//       <Box className="flex flex-col w-full pr-2 mt-2">
//         {errorMessage && (
//           <Alert severity="error" className='mt-2'>{errorMessage}</Alert>
//         )}
//         <div className='self-end mt-2'>
//           <CircularButton bgColor="main" size="xl" textSize="lg" onClick={handleStartSession}>
//             セッション<br/>を開始
//           </CircularButton>
//         </div>
//       </Box>
//     </Popup>
//   );
// };

// export default StartSessionPopup;
export {}