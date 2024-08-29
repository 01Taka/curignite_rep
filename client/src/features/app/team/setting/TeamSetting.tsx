import React, { FC, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PathParam } from '../../../../types/path/paths';
import { TeamData } from '../../../../types/firebase/db/team/teamsTypes';
import serviceFactory from '../../../../firebase/db/factory';
import TeamSettingView from './TeamSettingView';
import { CircularProgress } from '@mui/material';

const TeamSetting: FC = () => {
  const { [PathParam.TeamId]: teamId } = useParams<Record<string, string>>();
  const [team, setTeam] = useState<TeamData | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchTeamData = useCallback(async (teamId: string) => {
    try {
      const teamsDB = serviceFactory.getTeamsDB();
      const team = await teamsDB.getTeam(teamId);
      setTeam(team);
    } catch (error) {
      console.error("Error fetching team data:", error);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (teamId) {
      fetchTeamData(teamId);
    } else {
      setLoading(false);
    }
  }, [teamId, fetchTeamData]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!team) {
    return <div>Team not found or an error occurred.</div>;
  }

  return <TeamSettingView team={team} />;
};

export default TeamSetting;
