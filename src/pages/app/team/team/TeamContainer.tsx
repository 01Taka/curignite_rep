import { Avatar, CardHeader } from '@mui/material';
import React, { FC } from 'react';
import { cn } from '../../../../lib/utils';

interface TeamContainerProps {
    teamName: string;
    iconPath: string;
    participantsName: string[];
    myTeam: boolean;
}

const TeamContainer: FC<TeamContainerProps> = ({ teamName, iconPath, participantsName, myTeam }) => {
    const classes = cn("bg-secondaryBase rounded-lg max-w-96", myTeam && "border-l-8 border-main");
    return (
        <div className={classes}>
            <CardHeader
                avatar={<Avatar src={iconPath} alt="チームアイコン" />}
                title={<TitleContent teamName={teamName} participantsNumber={5} myTeam={myTeam} />}
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
    const displayedParticipants = participantsName.slice(0, maxDisplayNumber);
    return (
        <>
            {participantsName.length > 0 && (
                <div className="flex flex-col">
                    <div className="flex overflow-x-hidden max-w-full">
                        {displayedParticipants.map((participants, index) => (
                            <div key={index} className="mr-2 truncate max-w-24">
                                {[...participants].map((char) => (
                                    <>{char}</>
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
