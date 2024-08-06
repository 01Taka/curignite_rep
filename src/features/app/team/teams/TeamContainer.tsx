import { Avatar, CardHeader } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { cn } from '../../../../functions/utils';
import { Member } from '../../../../types/firebase/db/baseTypes';
import serviceFactory from '../../../../firebase/db/factory';
import { useAppSelector } from '../../../../redux/hooks';

interface TeamContainerProps {
  teamId: string;
  teamName: string;
  iconPath: string;
  members: Member[];
  myTeam: boolean;
  currentDisplay: boolean;
  memberNumber: number;
  maxDisplayLearningNumber?: number;
}

const TeamContainer: FC<TeamContainerProps> = ({ teamId, teamName, iconPath, members, myTeam, currentDisplay, memberNumber, maxDisplayLearningNumber = 3 }) => {
  const { uid } = useAppSelector(state => state.userSlice);

  const [learningMembers, setLearningMembers] = useState<Member[]>([]);

  useEffect(() => {
    const updateLearningMembers = async () => {
      if (uid && members.length > 0) {
        const teamService = serviceFactory.createTeamService(uid);
        const members = await teamService.getLearningMember(teamId);
        setLearningMembers(members);
      }
    }
    updateLearningMembers();
  }, [uid, teamId, members])

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
        avatar={<Avatar src={iconPath} alt="チームアイコン" />}
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
  if (maxDisplayNumber < 1) {
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
