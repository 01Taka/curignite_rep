import { Avatar, CardHeader } from '@mui/material';
import React, { FC } from 'react';
import { cn } from '../../../../../functions/utils';

interface TeamContainerProps {
  teamName: string;
  iconPath: string;
  participantsName: string[];
  myTeam: boolean;
  currentDisplay: boolean;
  participantsNumber?: number;
}

const TeamContainer: FC<TeamContainerProps> = ({ teamName, iconPath, participantsName, myTeam, currentDisplay, participantsNumber = 0 }) => {
  return (
    <div className={cn(
        currentDisplay && "border-2 scale-105",
        "bg-secondaryBase rounded-lg shadow-md ",
        "hover:shadow-lg hover:scale-105 hover:cursor-pointer",
        "transition duration-300",
        myTeam && "border-l-8 border-main",
      )}
    >
      <CardHeader
        avatar={<Avatar src={iconPath} alt="チームアイコン" />}
        title={<TitleContent teamName={teamName} participantsNumber={participantsNumber} myTeam={myTeam} />}
        subheader={<SubheaderContent participantsName={participantsName} />}
      />
    </div>
  );
};

interface TitleContentProps {
  teamName: string;
  participantsNumber: number;
  myTeam: boolean;
}

const TitleContent: FC<TitleContentProps> = ({ teamName, participantsNumber, myTeam }) => {
  return (
    <div className="flex justify-between max-w-72">
      <div>{teamName}</div>
      {myTeam && 
        <div className="text-grayText">{participantsNumber}人参加中</div>
      }
    </div>
  );
};

interface SubheaderContentProps {
  participantsName: string[];
  maxDisplayNumber?: number;
}

const SubheaderContent: FC<SubheaderContentProps> = ({ participantsName, maxDisplayNumber = 3 }) => {
  // Check if participantsName is an array
  if (!Array.isArray(participantsName)) {
    return null;
  }

  // Check if maxDisplayNumber is a valid number
  if (typeof maxDisplayNumber !== 'number' || maxDisplayNumber < 0) {
    return null;
  }

  const displayedParticipants = participantsName.slice(0, maxDisplayNumber);

  return (
    <>
      {participantsName.length > 0 && (
        <div className="flex flex-col">
          <div className="flex overflow-x-hidden max-w-full">
            {displayedParticipants.map((participant, index) => (
              <div key={index} className="mr-2 truncate max-w-24">
                {[...participant].map((char, charIndex) => (
                  <React.Fragment key={charIndex}>{char}</React.Fragment>
                ))}
              </div>
            ))}
          </div>
          <div className="flex">
            など<div className="font-bold">{participantsName.length}</div>人が学習中
          </div>
        </div>
      )}
    </>
  );
};

export default TeamContainer;
