import React, { FC, useEffect, useState } from 'react';
import { IndexedLearningSessionService } from '../../../functions/browserStorage/indexedDB/services/indexedLearningSessionService';
import { CurrentSession, Session } from '../../../types/browserStorage/indexedDB/learningSessionsTypes';
import { Typography, Box, CircularProgress, Divider, IconButton, Collapse, Popover } from '@mui/material';
import { convertToMilliseconds, dateTimeToString } from '../../../functions/dateTimeUtils';
import { differenceInDays, differenceInMinutes } from 'date-fns';
import CircularButton from '../../../components/input/button/CircularButton';
import { MoreHoriz, ExpandLess, ExpandMore } from '@mui/icons-material';
import { SECONDS_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import { useAppSelector } from '../../../redux/hooks';

const LearningSessions: FC = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSessions, setShowSessions] = useState<boolean>(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!uid) return;
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
    };

    fetchSessions();

    const intervalId = setInterval(async () => {
      try {
        if (!uid) return;
        const curSession = await IndexedLearningSessionService.getCurrentSession(uid);
        setCurrentSession(curSession);
      } catch (error) {
        console.error("Failed to update current session:", error);
      }
    }, 20 * SECONDS_IN_MILLISECOND);

    return () => clearInterval(intervalId); // コンポーネントのアンマウント時にクリーンアップ
  }, [uid]);

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
        toggleSessions={() => setShowSessions(!showSessions)}
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

const Sessions: FC<SessionsProps> = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return <Typography variant="body1">セッションがありません。</Typography>;
  }

  return (
    <Box className="pt-1">
      <Typography variant='h6'>
        今日のセッション
      </Typography>
      {sessions.map((session) => {
        const format = differenceInDays(session.endTime, session.startTime) < 1 ? 'HH:mm' : 'M/d HH:mm';
        return (
          <Box key={session.id} className="flex p-1">
            <Typography variant="body1">
              {dateTimeToString(session.startTime, { isAbsolute: true, format })}
            </Typography>
            <Typography variant="body1" className="px-1">
              ~
            </Typography>
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
};

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'session-popover' : undefined;

  if (!currentSession) {
    return <Typography variant="body1">現在のセッションはありません。</Typography>;
  }

  const format = differenceInDays(currentSession.startTime, new Date()) < 1 ? 'HH:mm' : 'M/d HH:mm';

  return (
    <Box>
      <Box className="flex justify-between items-center">
        <Box className="flex items-center">
          <Typography variant="h6" className="pr-2">
            現在のセッション
          </Typography>
          <IconButton onClick={toggleSessions}>
            {showSessions ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <IconButton onClick={handlePopoverOpen}>
          <MoreHoriz />
        </IconButton>
      </Box>
      <Box className="flex justify-between">
        <Typography variant="h6">
          {dateTimeToString(currentSession.startTime, { isAbsolute: true, format })}
        </Typography>
        <Typography variant="h6" className="px-1">
          ~
        </Typography>
        <Typography variant="h6">
          現在{"("}{dateTimeToString(new Date(), { isAbsolute: true, format })}{")"}
        </Typography>
        <Box className="ml-auto">
          <Typography variant='h6'>
            {convertToMilliseconds(differenceInMinutes(new Date(), currentSession.startTime))}分継続中
          </Typography>
        </Box>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <OperateSessionButtons />
      </Popover>
    </Box>
  );
};

const OperateSessionButtons: FC = () => {
  return (
    <Box className="flex p-3 space-x-4">
      <CircularButton bgColor="secondaryBase">一時中断</CircularButton>
      <CircularButton bgColor="success">セッションを終了</CircularButton>
    </Box>
  );
};

export default LearningSessions;
