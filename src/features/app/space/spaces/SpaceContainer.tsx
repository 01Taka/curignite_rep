import React, { FC } from 'react';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import { cn } from '../../../../functions/utils';

interface SpaceContainerProps {
  spaceName: string;
  authorName: string;
  startTime: string;
  introduction: string;
  someMemberName: string[];
  memberNumber: number;
  requiredApproval: boolean;
  mobileMode: boolean;
}

const SpaceContainer: FC<SpaceContainerProps> = ({
  spaceName,
  authorName,
  startTime,
  introduction,
  someMemberName,
  memberNumber,
  requiredApproval,
  mobileMode,
}) => {
  return (
    <div className='w-full max-w-md h-auto bg-secondaryBase rounded-lg p-4 flex flex-col space-y-2'>
      <div className='flex justify-between w-full'>
        <div  className={cn("flex", mobileMode ? "flex-col" : "items-center")}>
          <div className='font-semibold text-lg'>{spaceName}</div>
          <div className='flex items-center'>
            <div className='text-sm mx-2'>管理者: {authorName}</div>
            {!requiredApproval && (
              <div className='flex items-center'>
                <KeyOffIcon />
              </div>
            )}
          </div>
        </div>
        <div className='text-sm'>{startTime} 継続中</div>
      </div>
      {introduction &&
        <div className='text-sm overflow-auto max-h-24'>
          {introduction}
        </div>
      }
      {memberNumber > 0 && (
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
