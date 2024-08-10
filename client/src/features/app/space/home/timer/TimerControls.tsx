import React from 'react';
import SelectField from '../../../../../components/input/field/SelectFiled';
import { FormStateChangeFunc, SelectFieldChange, SelectItem } from '../../../../../types/util/componentsTypes';
import { SpaceTimerMode } from '../../../../../types/app/space/spaceTypes';


interface TimerControlsProps {
  cycleNumber: number;
  timerModes: SelectItem<SpaceTimerMode>[];
  timerMode: SpaceTimerMode;
  active: boolean;
  onTimerModeChange: FormStateChangeFunc;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  cycleNumber,
  timerModes,
  timerMode,
  active,
  onTimerModeChange,
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
          selectItems={timerModes}
          value={timerMode}
          variant="outlined"
          onChange={onTimerModeChange as SelectFieldChange}
        />
      </div>
      }
    </>
  );
};

export default TimerControls;
