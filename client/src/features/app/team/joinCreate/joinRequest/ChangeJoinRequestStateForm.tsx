import React, { FC, useState } from 'react';
import { JoinRequestData } from '../../../../../types/firebase/db/common/joinRequest/joinRequestStructure';
import { UserWithSupplementary } from '../../../../../types/firebase/db/user/userStructure';
import serviceFactory from '../../../../../firebase/db/factory';
import { JoinRequestStatus } from '../../../../../types/firebase/db/common/joinRequest/joinRequestSupplementTypes';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { JoinRequestStatusColors, JoinRequestStatusLabels } from '../../../../../constants/label/JoinRequestLabels';

interface ChangeJoinRequestStatusFormProps {
  teamId: string;
  targetJoinRequest: JoinRequestData;
  targetUser: UserWithSupplementary;
  onChanged?: () => void;
}

const ChangeJoinRequestStatusForm: FC<ChangeJoinRequestStatusFormProps> = ({ teamId, targetJoinRequest, targetUser, onChanged }) => {
  const [status, setStatus] = useState<JoinRequestStatus>(targetJoinRequest.status);

  const handleChangeStatus = async () => {
    const joinRequestService = serviceFactory.createTeamJoinRequestService();
    try {
      await joinRequestService.updateJoinRequestStatus(teamId, targetJoinRequest.docId, status);
      if (onChanged) onChanged();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {targetUser.username} の参加リクエストに応答する
      </Typography>
      <div className='space-x-4'>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as JoinRequestStatus)}
          style={{ backgroundColor: JoinRequestStatusColors[status] }}
          className='w-24 h-12'
        >
          <MenuItem value="pending">{JoinRequestStatusLabels.pending}</MenuItem>
          <MenuItem value="rejected">{JoinRequestStatusLabels.rejected}</MenuItem>
          <MenuItem value="allowed">{JoinRequestStatusLabels.allowed}</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={handleChangeStatus}>
          ステータスを更新
        </Button>
      </div>
    </div>
  );
};

export default ChangeJoinRequestStatusForm;
