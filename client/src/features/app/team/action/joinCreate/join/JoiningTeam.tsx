import React, { FC, useState } from 'react';
import { Alert, Avatar, Typography } from '@mui/material';
import { TeamData } from '../../../../../../types/firebase/db/team/teamsTypes';
import CircularButton from '../../../../../../components/input/button/CircularButton';
import serviceFactory from '../../../../../../firebase/db/factory';

interface JoiningTeamProps {
  team: TeamData;
  code: string;
  uid: string;
  onCancel: () => void;
  onJoined: () => void;
}

const JoiningTeam: FC<JoiningTeamProps> = ({ team, code, uid, onCancel, onJoined }) => {
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setError(null);
    try {
      const userTeamService = serviceFactory.createUserTeamService();
      await userTeamService.requestToJoinTeamByCode(uid, code);
      onJoined();
    } catch (err) {
      console.error('Failed to join team:', err);
      setError('チーム参加に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <TeamInfo team={team} />
      <JoinAction 
        requiresApproval={team.requiresApproval} 
        onJoin={handleJoin} 
        onCancel={onCancel} 
      />
      {error && <Alert severity='error'>{error}</Alert>}
    </div>
  );
};

// チーム情報表示コンポーネント
const TeamInfo: FC<{ team: TeamData }> = ({ team }) => (
  <div className="flex justify-center p-2 bg-secondaryBase rounded-lg min-w-64">
    <Avatar alt="チームアイコン" src={team.iconUrl} />
    <Typography variant="h4" className="ml-2">{team.teamName}</Typography>
  </div>
);

// チーム参加アクションコンポーネント
const JoinAction: FC<{ requiresApproval: boolean; onJoin: () => void; onCancel: () => void }> = ({
  requiresApproval,
  onJoin,
  onCancel
}) => (
  <div className="flex flex-col items-center px-8 py-4 border-4 border-secondaryBase rounded-lg mt-4">
    <Typography variant="h5" className="text-center">
      {requiresApproval 
        ? 'このチームへ参加のリクエストをしますか？' 
        : 'このチームに参加しますか？'}
    </Typography>
    <div className="flex space-x-8 mt-4">
      <CircularButton onClick={onCancel} bgColor="main" looks="frame" size="lg">
        キャンセル
      </CircularButton>
      <CircularButton onClick={onJoin} bgColor="main" size="lg">
        参加する
      </CircularButton>
    </div>
  </div>
);

export default JoiningTeam;
