import React, { FC, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { SpaceData, SpaceJoinState } from '../../../../types/firebase/db/space/spacesTypes';
import { useNavigate } from 'react-router-dom';
import { spacePaths } from '../../../../types/path/mainPaths';
import CircularButton from '../../../../components/input/button/CircularButton';
import serviceFactory from '../../../../firebase/db/factory';
import { useAppSelector } from '../../../../redux/hooks';
import { replaceParams } from '../../../../functions/path/pathUtils';

interface SpaceJoinPopupProps {
  space: SpaceData | null;
  joinState: SpaceJoinState;
  onClose: () => void;
}

const SpaceJoinPopup: FC<SpaceJoinPopupProps> = ({ space, joinState, onClose }) => {
  const navigate = useNavigate();
  const { uid } = useAppSelector(state => state.userSlice);
  const needAction = joinState === 'approved' || joinState === 'noInfo';

  useEffect(() => {
    if (joinState === 'participated' && space) {
      handelNavigateHome(space.docId);
    }
  }, [joinState, navigate]);

  const handleSendJoinRequest = useCallback(async () => {
    if (uid && space) {
      const spaceService = serviceFactory.createSpaceService();
      await spaceService.joinSpaceRequest(uid, space.docId);
    }
  }, [uid, space]);

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

  const handelNavigateHome = (spaceId: string) => {
    navigate(replaceParams(spacePaths.home, { "spaceId": spaceId }));
  }

  const onClickAction = () => {
    if (joinState === 'approved' && !!space) {
      handelNavigateHome(space.docId);
    } else if (joinState === 'noInfo') {
      handleSendJoinRequest();
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
