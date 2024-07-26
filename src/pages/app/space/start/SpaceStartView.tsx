import React, { FC } from 'react';
import CircularButton from '../../../../components/input/button/CircularButton';
import FormContainer from '../../../../components/container/FormContainer';
import { Divider, Typography } from '@mui/material';
import { PublicationTarget, SpaceData } from '../../../../types/firebase/db/spacesTypes';

export interface SpaceStartFormState {
  spaceName: string;
  introduction: string;
  publicationTarget: PublicationTarget;
  requiredApproval: boolean;
}

export const initialSpaceStartFormState: SpaceStartFormState = {
  spaceName: "",
  introduction: "",
  publicationTarget: "team",
  requiredApproval: true,
}

interface SpaceStartViewProps {
  spaces: SpaceData[];
  toSetting: () => void;
  onCreateSpace: () => void;
}

const SpaceStartView: FC<SpaceStartViewProps> = ({ toSetting, onCreateSpace }) => {
  return (
    <FormContainer flexCenter>
      <div className='flex flex-col relative items-center w-full'>
        <CircularButton mobileSize='sm' looks="frame" className='absolute right-0 top-0' onClick={toSetting}>
          スペース<br />の設定
        </CircularButton>
        <CircularButton size="x4l" mobileSize='xl' bgColor="main" className='mt-2' onClick={onCreateSpace}>
          スペースを<br />開始する
        </CircularButton>
      </div>
      <Divider className='w-full py-2'/>
      <Typography variant="h5" className='pt-4'>
        スペースに参加する
      </Typography>
      {/* ここにスペース一覧を表示するコンポーネントを追加 */}
    </FormContainer>
  )
}

export default SpaceStartView;
