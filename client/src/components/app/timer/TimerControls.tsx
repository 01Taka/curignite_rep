import React from 'react';
import SelectField from '../../input/field/SelectField';
import { TimerMode } from '../../../types/components/TimerTypes';
import { timerModeSelectItems } from '../../../constants/selectItems/timerSelectItems';
import { FormStateChangeAction } from '../../../types/app/formStateTypes';


interface TimerControlsProps {
  cycleNumber: number;
  timerMode: TimerMode;
  active: boolean;
  onChangeFormState: (action: FormStateChangeAction) => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  cycleNumber,
  timerMode,
  active,
  onChangeFormState,
}) => {
  return (
    <>
      <div className="absolute w-40 text-xl bottom-4 left-3/4 transform -translate-x-1/4">
        <div className="flex flex-col items-center pt-2 space-y-1">
          {timerMode === "pomodoro" && (
            <div>{cycleNumber}サイクル目</div>
          )}
        </div>
      </div>
      {!active &&
        <div className='absolute w-36 right-2/3 transform -translate-x-1/4'>
        <SelectField
          label='モード'
          name='timerMode'
          selectItems={timerModeSelectItems}
          value={timerMode}
          variant="outlined"
          onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })}
        />
      </div>
      }
    </>
  );
};

export default TimerControls;
