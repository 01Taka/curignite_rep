import React, { FC } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { dictToArray } from '../../../../functions/objectUtils';
import { Avatar, Box, Typography } from '@mui/material';
import { TeamData } from '../../../../types/firebase/db/team/teamStructure';
import { ConvertTimestampToNumber } from '../../../../types/firebase/db/formatTypes';
import { cn } from '../../../../functions/utils';

interface TeamIconsProps {
  onClickTeam: (team:  ConvertTimestampToNumber<TeamData>) => void;
}

const TeamIcons: FC<TeamIconsProps> = ({ onClickTeam }) => {
  const teamsMap = useAppSelector(state => state.teamSlice.teams);
  const teams = dictToArray(teamsMap);
  const { currentTeamId } = useAppSelector(state => state.teamSlice);

  return (
    <Box 
      className="gap-2 flex flex-wrap justify-around p-2"
    >
      {teams.map(team => (
        <Box
          key={team.docId} 
          className={cn(
            "flex flex-col justify-start items-center p-2 pb-4 bg-secondaryBase rounded-full w-fit h-fit hover:scale-110 transition-all duration-300 hover:cursor-pointer",
            currentTeamId === team.docId && "scale-110 border-2 border-main"
          )}
          onClick={() => onClickTeam(team)}
        >
          <Avatar
            src={team.iconUrl || undefined} 
            alt={`${team.teamName}アイコン`}
            sx={{ width: 100, height: 100 }}
          >
            {!team.iconUrl && team.teamName[0]}
          </Avatar>
          <Typography variant="h6">
            <div className='text-center w-24 overflow-x-auto'>
              {team.teamName}
            </div>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TeamIcons;
