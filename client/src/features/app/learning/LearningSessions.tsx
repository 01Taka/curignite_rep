import React, { FC, useEffect, useState } from 'react';
import { IndexedLearningSessionService } from '../../../functions/browserStorage/indexedDB/services/indexedLearningSessionService';
import { CurrentSession, Session } from '../../../types/browserStorage/indexedDB/learningSessionsTypes';
import { Typography, Box, CircularProgress } from '@mui/material';
import { dateTimeToString } from '../../../functions/dateTimeUtils';

const LearningSessions: FC = () => {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const updateSessions = async () => {
      try {
        const sessions = await IndexedLearningSessionService.getAllSessions();
        console.log(sessions);
        
        const currentSession = await IndexedLearningSessionService.getCurrentSession();
        setSessions(sessions);
        setCurrentSession(currentSession);
      } catch (error) {
        console.error("Failed to fetch learning sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    

    updateSessions();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-4 shadow-md rounded-lg w-64 max-h-48 overflow-y-auto">
      <Typography variant="h5" gutterBottom>
        学習セッション
      </Typography>
      {sessions && sessions.length > 0 ? (
        <Box className="">
          {sessions.map((session) => (
            <Box key={session.id} mb={2} p={2} border={1} borderRadius={4} borderColor="grey.300">
              <Typography variant="h6">
                開始時刻: {dateTimeToString(session.startTime, { isAbsolute: true, format: 'yyyy/MM/dd HH:mm'})}
              </Typography>
              <Typography variant="h6">
                終了時刻: {dateTimeToString(session.endTime, { isAbsolute: true, format: 'yyyy/MM/dd HH:mm'})}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">セッションがありません。</Typography>
      )}
    </Box>
  );
};

export default LearningSessions;
