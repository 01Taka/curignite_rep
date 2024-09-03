import React, { FC, useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import useSpaceData from '../../hooks/useSpaceData';
import { useAppSelector } from '../../../../../redux/hooks';
import MemberSelector from './MemberSelector';
import CircularButton from '../../../../../components/input/button/CircularButton';
import { FinishType } from '../../funcs/spaceFinishUtils';
import { BaseMemberRole } from '../../../../../types/firebase/db/baseTypes';

const SpaceFinishDialog: FC = () => {
  const { members } = useSpaceData();
  const uid = useAppSelector((state) => state.userSlice.uid);

  const [finishType, setFinishType] = useState<FinishType>("leave");
  const [transfereeId, setTransfereeId] = useState<string | null>(null);

  const currentUser = members?.find((member) => member.userId === uid);
  const isAdmin = currentUser?.role === BaseMemberRole.Admin;
  const isOnePerson = members?.length === 1;

  useEffect(() => {
    setFinishType(isAdmin ? 'delete' : 'leave');
  }, [isAdmin]);

  const handleTransferOfRights = () => {
    // 終了の処理を実装
  };

  return (
    <div className='flex flex-col max-w-sm mx-auto mt-4'>
      <Typography variant="h5">本当に学習を終えますか？</Typography>
      <div className="mt-4">
        <FormControl>
          <FormLabel id="finish-type-label">終了後の処理</FormLabel>
          <RadioGroup
            aria-labelledby="finish-type-label"
            value={finishType}
            onChange={(e) => setFinishType(e.target.value as FinishType)}
          >
            {isAdmin ? (
              <FormControlLabel value="delete" control={<Radio />} label="削除する" />
            ) : (
              <FormControlLabel value="leave" control={<Radio />} label="離脱する" />
            )}
            <FormControlLabel value="away" control={<Radio />} label="離席状態にする" />
            <FormControlLabel value="archiving" control={<Radio />} label="アーカイブに保存" />
            {isAdmin && !isOnePerson && (
              <FormControlLabel value="continuation" control={<Radio />} label="権限を譲渡して継続する" />
            )}
          </RadioGroup>
        </FormControl>
      </div>

      {finishType === 'continuation' && (
        <div className='mt-1'>
          <MemberSelector
            label="譲渡先"
            members={members?.filter(member => member.userId !== uid) || []}
            selectedMemberId={transfereeId || ''}
            setSelectedMemberId={setTransfereeId}
          />
        </div>
      )}

      <CircularButton bgColor="main" className='self-end mt-2' size="lg">
        終了する
      </CircularButton>
    </div>
  );
};

export default SpaceFinishDialog;
