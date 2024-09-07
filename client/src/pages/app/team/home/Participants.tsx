import React, { FC, memo } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { Typography, Box } from '@mui/material';
import TeamMembers from '../../../../features/app/team/members/TeamMembers';

const Participants: FC = () => {
  const { teams, currentTeamId } = useAppSelector((state) => state.teamSlice);
  const currentDisplayTeam = teams[currentTeamId];

  if (!currentDisplayTeam) {
    return <Typography variant="h6">チームが見つかりません。</Typography>;
  }

  return (
    <Box className="flex justify-center items-center w-full h-full">
      <Box className="flex flex-col p-4 space-y-4 border-2 border-main rounded-lg w-full max-w-lg h-4/5 overflow-y-auto">
        <Typography variant="h4">メンバー</Typography>
        <TeamMembers />
      </Box>
    </Box>
  );
};

export default memo(Participants);
