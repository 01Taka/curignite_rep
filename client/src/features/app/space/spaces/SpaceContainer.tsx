import React, { FC } from 'react';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import DoorFrontIcon from '@mui/icons-material/DoorFront';

interface SpaceContainerProps {
  spaceName: string;
  authorName: string;
  startTime: string;
  introduction: string;
  someMemberName: string[];
  memberNumber: number;
  requiresApproval: boolean;
  onClick: () => void;
}

const SpaceContainer: FC<SpaceContainerProps> = ({
  spaceName,
  authorName,
  startTime,
  introduction,
  someMemberName,
  memberNumber,
  requiresApproval,
  onClick,
}) => {
  return (
    <div className='w-full max-w-md h-auto bg-secondaryBase rounded-lg p-4 flex flex-col space-y-2' onClick={onClick}>
      <div className='flex justify-between w-full'>
        <div  className={"flex flex-col"}>
          <div className='font-semibold text-lg'>{spaceName}</div>
          <div className='flex items-center'>
            <div className='text-sm mx-2'>作成者: {authorName}</div>
              <div className='flex items-center'>
              {!requiresApproval? (
                <DoorFrontIcon  color="action"/>
              ): (
                <MeetingRoomRoundedIcon color="primary" />
              )}
              </div>
          </div>
        </div>
        <div className='text-sm'>{startTime} 継続中</div>
      </div>
      {introduction &&
        <div className='text-sm overflow-auto max-h-24'>
          {introduction}
        </div>
      }
      {memberNumber > 1 && (
        <div className='flex items-center space-x-2 text-xs'>
          {someMemberName && someMemberName.map((name, index) => (
            <div key={index} className='border-2 border-primaryBase rounded-full px-2 py-0'>
              {name}
            </div>
          ))}
          <div className='flex'>など<span className='font-bold'>{memberNumber}人</span>が参加中</div>
        </div>
      )}
    </div>
  );
};

export default SpaceContainer;
