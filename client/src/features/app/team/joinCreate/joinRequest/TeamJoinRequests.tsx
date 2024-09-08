import React, { FC, useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../redux/hooks';
import serviceFactory from '../../../../../firebase/db/factory';
import { JoinRequestData } from '../../../../../types/firebase/db/common/joinRequest/joinRequestStructure';
import { useUserMap } from '../../../../hooks/useUserMap';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { JoinRequestStatusColors, JoinRequestStatusLabels } from '../../../../../constants/label/JoinRequestLabels';
import Popup from '../../../../../components/util/Popup';
import { UserWithSupplementary } from '../../../../../types/firebase/db/user/userStructure';
import ChangeJoinRequestStatusForm from './ChangeJoinRequestStateForm';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { cn } from '../../../../../functions/utils';

const TeamJoinRequests: FC = () => {
  const teamId = useAppSelector(state => state.teamSlice.currentTeamId);
  const { membersId, loading: membersLoading, error: membersError } = useTeamMembers(teamId);
  const [joinRequests, setJoinRequests] = useState<JoinRequestData[]>([]);
  const { userMap, loading: usersLoading, error: usersError } = useUserMap(joinRequests.map(request => request.docId));
  const [selectedRequest, setSelectedRequest] = useState<JoinRequestData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserWithSupplementary | null>(null);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const updateJoinRequests = useCallback(async () => {
    if (!teamId) return;
    try {
      const joinRequestService = serviceFactory.createTeamJoinRequestService();
      const fetchedJoinRequests = await joinRequestService.getAllJoinRequests(teamId);
      setJoinRequests(fetchedJoinRequests);
    } catch (error) {
      console.error('Error fetching join requests:', error);
    }
  }, [teamId]);

  useEffect(() => {
    updateJoinRequests();
  }, [updateJoinRequests]);

  const handleOpenPopup = (request: JoinRequestData, user: UserWithSupplementary) => {
    setSelectedRequest(request);
    setSelectedUser(user);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedRequest(null);
    setSelectedUser(null);
  };

  if (membersLoading || usersLoading) {
    return <CircularProgress />;
  }

  if (membersError || usersError) {
    return <Typography color="error">Error loading join requests: {membersError || usersError}</Typography>;
  }

  return (
    <>
      <List>
        {joinRequests.map((request) => {
          const user = userMap[request.docId];
          if (!user) return null;

          const isMember = membersId.includes(user.docId);
          const backgroundColor = isMember ? "#BBB" : JoinRequestStatusColors[request.status];
          const label = isMember ? "参加中" : JoinRequestStatusLabels[request.status];

          return (
            <div key={request.docId} className="flex items-center space-x-4">
              <Avatar src={user.avatarIconUrl || undefined}>
                {!user.avatarIconUrl && user.username[0]}
              </Avatar>
              <div className="flex flex-col">
                <Typography variant="h6">{user.username}</Typography>
                <Typography>At: {format(request.requestedAt.toDate(), 'M/d HH:mm')}</Typography>
              </div>
              <div
                className={cn(
                  'text-center rounded p-1 w-16 h-8 transition duration-300',
                  !isMember && 'shadow-lg hover:cursor-pointer hover:scale-110'
                )}
                style={{ backgroundColor }}
                onClick={!isMember ? () => handleOpenPopup(request, user) : undefined}
              >
                {label}
              </div>
            </div>
          );
        })}
      </List>
      {selectedRequest && selectedUser && (
        <Popup open={isPopupOpen} handleClose={handleClosePopup}>
          <ChangeJoinRequestStatusForm 
            teamId={teamId} 
            targetJoinRequest={selectedRequest} 
            targetUser={selectedUser}
            onChanged={handleClosePopup}
          />
        </Popup>
      )}
    </>
  );
};

export default TeamJoinRequests;
