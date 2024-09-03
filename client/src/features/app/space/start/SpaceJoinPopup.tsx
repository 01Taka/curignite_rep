import React, { FC, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { SpaceData } from '../../../../types/firebase/db/space/spaceStructure';
import CircularButton from '../../../../components/input/button/CircularButton';
import { BaseParticipationState } from '../../../../types/firebase/db/baseTypes';

interface SpaceJoinPopupProps {
  space: SpaceData | null;
  joinState: BaseParticipationState | "error";
  handleSpaceJoin: (spaceId: string) => void;
  onClose: () => void;
}

const SpaceJoinPopup: FC<SpaceJoinPopupProps> = ({ space, joinState, handleSpaceJoin, onClose }) => {
  const needAction = joinState === BaseParticipationState.Eligible || joinState === BaseParticipationState.None;

  useEffect(() => {
    if (joinState === BaseParticipationState.Active && space) {
      handleSpaceJoin(space.docId);
    }
  }, [joinState, space, handleSpaceJoin]);

  const renderJoinStateMessage = () => {
    if (!space) {
      return 'スペースが見つかりませんでした。';
    }
    switch (joinState) {
      case BaseParticipationState.Pending:
        return '参加リクエストを承認待ちです。';
      case BaseParticipationState.Eligible:
        return `${space.spaceName}に参加しますか？`;
      case BaseParticipationState.Declined:
        return 'このスペースには参加できません。';
      case BaseParticipationState.None:
        return `${space.spaceName}に参加リクエストを送りますか？`;
      case 'error':
        return 'エラーが発生しました。もう一度試してください。';
      default:
        return "";
    }
  };

  const onClickAction = () => {
    if (!space || !needAction) return;
    handleSpaceJoin(space.docId);
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
            {joinState === BaseParticipationState.Eligible ? '参加する' : 'リクエスト'}
          </CircularButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SpaceJoinPopup;
