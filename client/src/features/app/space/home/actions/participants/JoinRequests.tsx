import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React, { FC, useMemo } from 'react';
import { ActionInfo } from '../../../../../../types/firebase/db/baseTypes';
import { DocumentIdMap } from '../../../../../../types/firebase/db/formatTypes';
import { UserData } from '../../../../../../types/firebase/db/user/usersTypes';
import { SpaceActionTypes } from '../../../../../../types/firebase/db/space/spaceStructure';
import { cn } from '../../../../../../functions/utils';
import { dateTimeToString } from '../../../../../../functions/dateTimeUtils';

interface JoinRequestsProps {
  joinRequests: ActionInfo<SpaceActionTypes>[];
  userMap: DocumentIdMap<UserData>;
}

const actionNames: Record<SpaceActionTypes, string> = {
  approved: "参加中",
  pending: "承認待ち",
  invited: "許可しました",
  rejected: "拒否中",
};

const actionColors: Record<SpaceActionTypes, string> = {
  approved: "text-gray-500",
  pending: "text-blue-500",
  invited: "text-green-500",
  rejected: "text-red-500",
};

const getActionName = (actionType: SpaceActionTypes): string => actionNames[actionType] || "";
const getActionColorClass = (actionType: SpaceActionTypes): string => actionColors[actionType] || "";

const JoinRequests: FC<JoinRequestsProps> = ({ joinRequests, userMap }) => {
  const requestElements = useMemo(() => {
    return joinRequests ? joinRequests.map((request) => {
      const user = userMap[request.userId];
      const actionName = getActionName(request.actionType);
      const actionColorClass = getActionColorClass(request.actionType);
      const actionTime = dateTimeToString(request.actionAt, { isAbsolute: true, format: "mm:ss" });

      return (
        <ListItem key={request.userId} className='h-14 border-2 border-gray-100 rounded-lg'>
          <ListItemAvatar>
            <Avatar src={user?.iconUrl} />
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
    }) : null;
  }, [joinRequests, userMap]);

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
