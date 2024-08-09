import { Dispatch } from '@reduxjs/toolkit';
import serviceFactory from '../../../firebase/db/factory';
import store from '../../store';
import { setSpaces, setSpacesUpdateState } from '../../slices/space/spaceSlice';
import { autoUpdateCollection } from '../../../functions/redux/reduxUtils';


/**
 * ユーザーの所属チーム情報を自動更新する関数
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
export const autoUpdateSpaces = (dispatch: Dispatch, userId: string) => {
  const spacesDB = serviceFactory.getSpacesDB();
  const spaceService = serviceFactory.createSpaceService();

  autoUpdateCollection(
    spacesDB,
    userId,
    spaceService.filterSpacesByUserId.bind(spaceService),
    setSpaces,
    setSpacesUpdateState,
    () => store.getState().spaceSlice.spaces,
    dispatch
  );
};
