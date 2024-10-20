import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { msToTime } from '../../../../functions/dateTimeUtils';
import PopupSelectField from '../../../../components/input/popupField/PopupSelectField';
import useFormState from '../../../hooks/useFormState';
import useToggle from '../../../hooks/useToggle';
import ClickableText from '../../../../components/navigation/ClickableText';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
import { sequentialNumber } from '../../../../functions/objectUtils';

interface GoalDetailsProps {
  target: string;
  timeMs: number;
  extent: number;
  extentUnit: string;
}

const GoalDetails: React.FC<GoalDetailsProps> = ({ target, timeMs, extent, extentUnit }) => {
  const times = [...sequentialNumber(1, 11).map(i => i * 5), ...sequentialNumber(6, 18).map(i => i * 10)];
  const additionalSelectItem = times.map(i => ({ label: `${String(i)}分`, value: i * MINUTES_IN_MILLISECOND }));
  const selectItem = [
    { label: `${String(Math.floor(timeMs / MINUTES_IN_MILLISECOND))}分`, value: timeMs },
    ...additionalSelectItem
  ]

  const { open, toOpen, toClose } = useToggle();
  const { formState, names, updateField } = useFormState({ time: timeMs, extent });

  const formatTime = msToTime(formState.time);

  useEffect(() => {
    console.log(formState);
  }, [formState]);

  useEffect(() => {
    toClose();
  }, [formState.time, toClose]);

  return (
    <Box>
      <Typography>
        {target}を
      </Typography>
      <ClickableText onClick={toOpen} clickablePart={formatTime}>
        {`${formatTime}で`}
      </ClickableText>
      <ClickableText onClick={() => {}} clickablePart={`${formState.extent}${extentUnit}`}>
        {formState.extent}{extentUnit}終わらせる
      </ClickableText>
      <PopupSelectField
        open={open}
        name={names.time}
        selectItems={selectItem}
        updateField={updateField}
        onClose={toClose}
      />
    </Box>
  );
};

export default GoalDetails;