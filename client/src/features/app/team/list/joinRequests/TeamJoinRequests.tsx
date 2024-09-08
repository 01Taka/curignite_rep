import React, { FC } from 'react';
import { JoinRequestData } from '../../../../../types/firebase/db/common/joinRequest/joinRequestStructure';
import { useUserMap } from '../../../../hooks/useUserMap';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Typography } from '@mui/material';
import { cn } from '../../../../../functions/utils';

interface TeamJoinRequestsProps {
  joinRequests: JoinRequestData[];
}

const TeamJoinRequests: FC<TeamJoinRequestsProps> = ({ joinRequests }) => {
  const { userMap, loading, error } = useUserMap(joinRequests.map(request => request.docId));

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">エラーが発生しました: {error}</Typography>;

  return (
    <List className="space-y-2">
      {joinRequests.map((request) => {
        const user = userMap[request.docId];

        if (!user) return null;

        return (
          <ListItem key={request.docId} className={cn("bg-white rounded-md shadow-md p-2", "hover:bg-gray-50")}>
            <ListItemAvatar>
              <Avatar src={user.avatarIconUrl || ''} alt={user.username} />
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary={`ステータス: ${request.status} - リクエスト日時: ${request.requestedAt.toDate().toLocaleString()}`}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default TeamJoinRequests;
