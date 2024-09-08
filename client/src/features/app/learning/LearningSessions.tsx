import React, { FC, useEffect, useState, useCallback } from 'react';
import { IndexedLearningSessionService } from '../../../functions/browserStorage/indexedDB/services/indexedLearningSessionService';
import { CurrentSession, Session } from '../../../types/browserStorage/indexedDB/learningSessionsTypes';
import { Typography, Box, CircularProgress, Divider, IconButton, Collapse } from '@mui/material';
import { convertToMilliseconds, dateTimeToString } from '../../../functions/dateTimeUtils';
import { differenceInDays, differenceInMinutes } from 'date-fns';
import CircularButton from '../../../components/input/button/CircularButton';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { SECONDS_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import { useAppSelector } from '../../../redux/hooks';
import serviceFactory from '../../../firebase/db/factory';

const LearningSessions: FC = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSessions, setShowSessions] = useState<boolean>(false);

  const fetchSessions = useCallback(async () => {
    if (!uid) return;
    try {
      const [allSessions, curSession] = await Promise.all([
        IndexedLearningSessionService.getAllSessions(uid),
        IndexedLearningSessionService.getCurrentSession(uid),
      ]);
      setSessions(allSessions);
      setCurrentSession(curSession);
    } catch (error) {
      console.error("Failed to fetch learning sessions:", error);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchSessions();

    const intervalId = setInterval(fetchSessions, 20 * SECONDS_IN_MILLISECOND);
    return () => clearInterval(intervalId);
  }, [fetchSessions]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-4 shadow-md rounded-lg w-96 max-h-48 overflow-y-auto">
      <CurrentSessionDisplay
        currentSession={currentSession}
        showSessions={showSessions}
        toggleSessions={() => setShowSessions(prev => !prev)}
      />
      <Collapse in={showSessions}>
        <Divider className='pt-1' />
        <Sessions sessions={sessions} />
      </Collapse>
    </Box>
  );
};

interface SessionsProps {
  sessions: Session[] | null;
}

const Sessions: FC<SessionsProps> = React.memo(({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return <Typography variant="body1">セッションがありません。</Typography>;
  }

  return (
    <Box className="pt-1">
      <Typography variant='h6'>今日のセッション</Typography>
      {sessions.map(session => {
        const format = differenceInDays(session.endTime, session.startTime) < 1 ? 'HH:mm' : 'M/d HH:mm';
        return (
          <Box key={session.id} className="flex p-1">
            <Typography variant="body1">
              {dateTimeToString(session.startTime, { isAbsolute: true, format })}
            </Typography>
            <Typography variant="body1" className="px-1">~</Typography>
            <Typography variant="body1">
              {dateTimeToString(session.endTime, { isAbsolute: true, format })}
            </Typography>
            <Box className="ml-auto">
              <Typography>
                {convertToMilliseconds(differenceInMinutes(session.endTime, session.startTime))}分継続
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
});

interface CurrentSessionDisplayProps {
  currentSession: CurrentSession | null;
  showSessions: boolean;
  toggleSessions: () => void;
}

const CurrentSessionDisplay: FC<CurrentSessionDisplayProps> = ({
  currentSession,
  showSessions,
  toggleSessions,
}) => {

  if (!currentSession) {
    return <Typography variant="body1">現在のセッションはありません。</Typography>;
  }

  const format = differenceInDays(currentSession.startTime, new Date()) < 1 ? 'HH:mm' : 'M/d HH:mm';

  return (
    <div className="flex justify-around items-center">
      <div className="flex flex-col">
        <Box className="flex justify-between items-center">
          <Box className="flex items-center">
            <Typography variant="h6" className="pr-2">現在のセッション</Typography>
            <IconButton onClick={toggleSessions}>
              {showSessions ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>
        <Box className="flex">
          <Typography variant="h6">
            {dateTimeToString(currentSession.startTime, { isAbsolute: true, format })}
          </Typography>
          <Typography variant="h6" className="px-1">~</Typography>
          <Typography variant="h6">
            現在{"("}{dateTimeToString(new Date(), { isAbsolute: true, format })}{")"}
          </Typography>
        </Box>
        <Box>
          <Typography variant='h6'>
            {convertToMilliseconds(differenceInMinutes(new Date(), currentSession.startTime))}分継続中
          </Typography>
        </Box>
      </div>
      <OperateSessionButtons />
    </div>
  );
};

const OperateSessionButtons: FC = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [finishedSuccess, setFinishedSuccess] = useState(false);

  const uid = useAppSelector(state => state.userSlice.uid);

  const handleFinishSession = useCallback(async () => {
    if (uid) {
      try {
        setLoading(true);
        setFinishedSuccess(false);
        const userService = serviceFactory.createUserService();
        const sessionService = serviceFactory.createUserLearningSessionService();
        const currentSession = await IndexedLearningSessionService.getCurrentSession(uid);
        if (!currentSession) return;
        await sessionService.recordSession(uid, currentSession.startTime, new Date());
        await userService.setIsLearning(uid, false);
        await IndexedLearningSessionService.deleteCurrentSession(uid);
        setFinishedSuccess(true);
      } catch (error) {
        console.error("Failed to finish session:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [uid]);

  return (
    <Box className="flex pt-1">
      {finishedSuccess ? (
        <div className='flex justify-center items-center w-20 h-20 rounded-full bg-gray-300'>
          終了しました
        </div>
      ) : (
        <CircularButton bgColor="success" size="lg" onClick={handleFinishSession} invalidation={loading}>
          {loading ? "セッションを終了" : <CircularProgress />}
        </CircularButton>
      )}
    </Box>
  );
});

export default LearningSessions;
