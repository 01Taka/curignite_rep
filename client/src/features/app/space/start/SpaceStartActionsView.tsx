import React, { FC } from 'react';
import { SpaceStartActionsViewProps } from '../../../../types/app/space/spaceTypes';
import CircularButton from '../../../../components/input/button/CircularButton';
import { Divider } from '@mui/material';

const SpaceStartActionsView: FC<SpaceStartActionsViewProps> = ({ toSetting, onStart }) => {
  return (
    <>
      <div className='flex flex-col relative items-center w-full'>
        <CircularButton mobileSize='sm' looks="frame" className='absolute right-0 top-0' onClick={toSetting}>
          スペース<br />の設定
        </CircularButton>
        <CircularButton size="x4l" mobileSize='xl' bgColor="main" className='mt-2' onClick={onStart}>
          スペースを<br />開始する
        </CircularButton>
      </div>
      <Divider className='w-full py-2'/>
    </>
  );
}

export default SpaceStartActionsView;
