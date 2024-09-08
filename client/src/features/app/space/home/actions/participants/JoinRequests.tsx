import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React, { FC, useMemo } from 'react';
import { DocumentIdMap } from '../../../../../../types/firebase/db/formatTypes';
import { cn } from '../../../../../../functions/utils';
import { dateTimeToString } from '../../../../../../functions/dateTimeUtils';
import { UserData, UserWithSupplementary } from '../../../../../../types/firebase/db/user/userStructure';
import { JoinRequestStatus } from '../../../../../../types/firebase/db/common/joinRequest/joinRequestSupplementTypes';
import { JoinRequestData } from '../../../../../../types/firebase/db/common/joinRequest/joinRequestStructure';

type JoinStatus = JoinRequestStatus | "active";

const actionNames: Record<JoinStatus, string> = {
  active: "参加中",
  pending: "承認待ち",
  allowed: "許可しました",
  rejected: "拒否中",
};

const actionColors: Record<JoinStatus, string> = {
  active: "text-gray-500",
  pending: "text-blue-500",
  allowed: "text-green-500",
  rejected: "text-red-500",
};

const getActionName = (actionType: JoinStatus): string => actionNames[actionType];
const getActionColorClass = (actionType: JoinStatus): string => actionColors[actionType];

interface JoinRequestsProps {
  joinRequests: JoinRequestData[];
  activeMembersId: string[];
  userMap: DocumentIdMap<UserWithSupplementary>;
}

const JoinRequests: FC<JoinRequestsProps> = ({ joinRequests, userMap, activeMembersId }) => {
  const requestElements = useMemo(() => {
    return joinRequests.map((request) => {
      const user = userMap[request.docId];
      const isActive = activeMembersId.includes(request.docId);
      const status = request.status === "allowed" && isActive ? "active" : request.status;
      const actionName = getActionName(status);
      const actionColorClass = getActionColorClass(status);
      const actionTime = dateTimeToString(request.actionAt, { isAbsolute: true, format: "mm:ss" });

      return (
        <ListItem key={request.userId} className='h-14 border-2 border-gray-100 rounded-lg'>
          <ListItemAvatar>
            <Avatar src={user?.avatarIconUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={user?.username ?? "名前: 不明"}
            secondary={<span className='text-sm text-grayText'>At {actionTime}</span>}
          />
          <Typography variant="body2" className={cn('w-20 text-center ml-5 px-2 py-1 rounded-md bg-gray-100', actionColorClass)}>
            {actionName}
          </Typography>
        </ListItem>
      );
    });
  }, [joinRequests, userMap, activeMembersId]);

  return (
    <div className='w-full'>
      <Typography variant="h6" className="mb-2">
        Join Requests
      </Typography>
      <List className='space-y-2'>
        {requestElements}
      </List>
    </div>
  );
};

export default JoinRequests;
