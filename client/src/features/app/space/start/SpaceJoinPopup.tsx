import React, { FC, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { SpaceData } from '../../../../types/firebase/db/space/spaceStructure';
import CircularButton from '../../../../components/input/button/CircularButton';
import { BaseParticipationStatus } from '../../../../types/firebase/db/baseTypes';

interface SpaceJoinPopupProps {
  space: SpaceData | null;
  participationStatus: BaseParticipationStatus | "error";
  handleSpaceJoin: (spaceId: string) => void;
  onClose: () => void;
}

const SpaceJoinPopup: FC<SpaceJoinPopupProps> = ({ space, participationStatus, handleSpaceJoin, onClose }) => {
  const needAction = participationStatus === BaseParticipationStatus.Eligible || participationStatus === BaseParticipationStatus.None;

  useEffect(() => {
    if (participationStatus === BaseParticipationStatus.Active && space) {
      handleSpaceJoin(space.docId);
    }
  }, [participationStatus, space, handleSpaceJoin]);

  const renderJoinStateMessage = () => {
    if (!space) {
      return 'スペースが見つかりませんでした。';
    }
    switch (participationStatus) {
      case BaseParticipationStatus.Pending:
        return '参加リクエストを承認待ちです。';
      case BaseParticipationStatus.Eligible:
        return `${space.spaceName}に参加しますか？`;
      case BaseParticipationStatus.Declined:
        return 'このスペースには参加できません。';
      case BaseParticipationStatus.None:
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
            {participationStatus === BaseParticipationStatus.Eligible ? '参加する' : 'リクエスト'}
          </CircularButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SpaceJoinPopup;
