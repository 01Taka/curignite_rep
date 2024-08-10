import React, { FC, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import CircularButton from '../../../../components/input/button/CircularButton';
import { JoinState } from '../../../../types/firebase/db/baseTypes';

interface SpaceJoinPopupProps {
  space: SpaceData | null;
  joinState: JoinState;
  onSendRequest: (spaceId: string) => void;
  onJoinSpace: (spaceId: string) => void;
  onClose: () => void;
}

const SpaceJoinPopup: FC<SpaceJoinPopupProps> = ({ space, joinState, onSendRequest, onJoinSpace, onClose }) => {
  const needAction = joinState === 'approved' || joinState === 'noInfo';

  useEffect(() => {
    if (joinState === 'participated' && space) {
      onJoinSpace(space.docId);
    }
  }, [joinState, space, onJoinSpace]);

  const renderJoinStateMessage = () => {
    if (!space) {
      return 'スペースが見つかりませんでした。';
    }
    switch (joinState) {
      case 'participated':
        return '';
      case 'requesting':
        return '参加リクエストを承認待ちです。';
      case 'approved':
        return `${space.spaceName}に参加しますか？`;
      case 'rejected':
        return 'このスペースには参加できません。';
      case 'noInfo':
        return `${space.spaceName}に参加リクエストを送りますか？`;
      case 'error':
      default:
        return 'エラーが発生しました。もう一度試してください。';
    }
  };

  const onClickAction = () => {
    if (!space) return;
    if (joinState === 'approved') {
      onJoinSpace(space.docId);
    } else if (joinState === 'noInfo') {
      onSendRequest(space.docId);
    }
  };

  return (
    <Dialog open={!!space} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-lg font-bold text-gray-800">
        {space ? (
          <div className='flex items-center'>
            {space.iconUrl && (
              <img
                alt={`${space.spaceName}アイコン`}
                src={space.iconUrl}
                className='w-8 h-8 mr-2'
              />
            )}
            {space.spaceName}
          </div>
        ) : (
          'Loading...'
        )}
      </DialogTitle>
      <DialogContent className="space-y-2">
        {space && (
          <>
            <div>
              <p className="text-sm text-gray-600 max-h-64 overflow-y-auto">{space.description}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              {renderJoinStateMessage()}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <CircularButton onClick={onClose} bgColor={needAction ? 'secondaryBase' : 'main'}>
          閉じる
        </CircularButton>
        {needAction && (
          <CircularButton bgColor="main" onClick={onClickAction}>
            {joinState === 'approved' ? '参加する' : 'リクエスト'}
          </CircularButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SpaceJoinPopup;
