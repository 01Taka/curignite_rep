import React, { FC, useState } from 'react';
import { TeamData } from '../../../../types/firebase/db/team/teamsTypes';
import { Avatar, Switch, Typography, Tabs, Tab, Box } from '@mui/material';
import TeamMembers from '../participants/members/TeamMembers';
import TeamActions from '../participants/actions/TeamActions';
import serviceFactory from '../../../../firebase/db/factory';
import TeamCodeHandler from './TeamCodeHandler';

interface TeamSettingViewProps {
  team: TeamData;
}

const TeamSettingView: FC<TeamSettingViewProps> = ({ team }) => {
  const teamActions = serviceFactory.createTeamService().getTeamActions(team);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className='flex w-5/6 mx-auto pt-8'>
      <div className="flex flex-col p-4 w-1/2">
        <div className="flex items-center mb-4 space-x-2">
          <Avatar alt="チームアイコン" src={team.iconUrl} sx={{ width: 80, height: 80 }} />
          <Typography variant="h6" component="span" className="ml-4">
            {team.teamName}
          </Typography>
        </div>

        <div className='flex flex-col mb-4'>
          <Typography variant='h4'>
            チームの紹介文
          </Typography>
          <div className='w-full h-40 p-2 border-2 border-gray-400 rounded-lg'>
            {team.description}
          </div>
        </div>
        <div className='p-2 border-2 border-gray-400 rounded-lg'>
          <TeamCodeHandler team={team}/>
        </div>
        <div className='p-2 mt-2 border-2 border-gray-400 rounded-lg'>
          <Typography variant="body2" className="flex items-center">
            チームへの参加時に承認を必要とする
            <Switch defaultChecked={team.requiresApproval} />
          </Typography>
        </div>
      </div>

      <div className='w-1/2 mt-10'>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label="アクション" />
          <Tab label="メンバー" />
        </Tabs>

        <Box className='mt-4'>
          {tabIndex === 0 && <TeamActions actions={teamActions} />}
          {tabIndex === 1 && <TeamMembers members={team.members} />}
        </Box>
      </div>
    </div>
  );
};

export default TeamSettingView;
