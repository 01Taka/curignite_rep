import React, { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { SpaceMemberData } from '../../../../../types/firebase/db/space/spaceMembersTypes';

interface MemberSelectorProps {
  label: string;
  members: SpaceMemberData[];
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
}

const MemberSelector: FC<MemberSelectorProps> = ({
  label,
  members,
  selectedMemberId,
  setSelectedMemberId,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="member-select-label">{label}</InputLabel>
      <Select
        labelId="member-select-label"
        id="member-select"
        value={selectedMemberId}
        onChange={(e) => setSelectedMemberId(e.target.value)}
      >
        {members.map((member) => (
          <MenuItem key={member.userId} value={member.userId}>
            <SelectItem member={member} isAway={member.isAway} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface SelectItemProps {
  member: SpaceMemberData;
  isAway: boolean;
}

const SelectItem: FC<SelectItemProps> = ({ member, isAway = false }) => {
  return (
    <div className="flex items-center space-x-4">
      <Typography>{member.username}</Typography>
      {isAway && <Typography variant="caption" className="ml-2">離席中</Typography>}
    </div>
  )
}

export default MemberSelector;
