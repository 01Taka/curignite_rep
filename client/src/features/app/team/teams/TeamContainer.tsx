import { Avatar, CardHeader } from '@mui/material';
import React, { FC } from 'react';
import { cn } from '../../../../functions/utils';
import { Member } from '../../../../types/firebase/db/baseTypes';

interface TeamContainerProps {
  teamName: string;
  iconUrl: string;
  learningMembers: Member[];
  myTeam: boolean;
  currentDisplay: boolean;
  memberNumber: number;
  maxDisplayLearningNumber?: number;
}

const TeamContainer: FC<TeamContainerProps> = ({ teamName, iconUrl, myTeam, currentDisplay, memberNumber, learningMembers, maxDisplayLearningNumber = 3 }) => {  
  return (
    <div className={cn(
        currentDisplay && "border-2 scale-105",
        "bg-secondaryBase rounded-lg shadow-md border-main",
        "hover:shadow-lg hover:scale-105 hover:cursor-pointer",
        "transition duration-300",
        myTeam && "border-l-8",
      )}
    >
      <CardHeader
        avatar={<Avatar src={iconUrl} alt="チームアイコン" />}
        title={<TitleContent teamName={teamName} memberNumber={memberNumber} myTeam={myTeam} />}
        subheader={<SubheaderContent learningMembers={learningMembers} maxDisplayNumber={maxDisplayLearningNumber}/>}
      />
    </div>
  );
};

interface TitleContentProps {
  teamName: string;
  memberNumber: number;
  myTeam: boolean;
}

const TitleContent: FC<TitleContentProps> = ({ teamName, memberNumber, myTeam }) => {
  return (
    <div className="flex justify-between max-w-72">
      <div>{teamName}</div>
      {myTeam && 
        <div className="text-grayText">{memberNumber}人参加中</div>
      }
    </div>
  );
};

interface SubheaderContentProps {
  learningMembers: Member[];
  maxDisplayNumber?: number;
}

const SubheaderContent: FC<SubheaderContentProps> = ({ learningMembers, maxDisplayNumber = 3 }) => {
  if (maxDisplayNumber < 1 || !learningMembers || learningMembers.length === 0) {
    return null;
  }

  const displayedMembers = learningMembers.slice(0, maxDisplayNumber);

  return (
    <>
      {learningMembers.length > 0 && (
        <div className="flex flex-col">
          <div className="flex overflow-x-hidden max-w-full">
            {displayedMembers && displayedMembers.map((member, index) => (
              <div key={index} className="mr-2 truncate max-w-24">
                {[...member.username].map((char, charIndex) => (
                  <React.Fragment key={charIndex}>{char}</React.Fragment>
                ))}
              </div>
            ))}
          </div>
          <div className="flex">
            など<div className="font-bold">{learningMembers.length}</div>人が学習中
          </div>
        </div>
      )}
    </>
  );
};

export default TeamContainer;
