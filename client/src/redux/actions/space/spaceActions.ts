import { Dispatch } from '@reduxjs/toolkit';
import serviceFactory from '../../../firebase/db/factory';
import store from '../../store';
import { assignSpaceInfoMap, setSpacesUpdateState } from '../../slices/space/spaceSlice';
import { autoUpdateCollection } from '../../../functions/redux/reduxUtils';
import { SpaceData } from '../../../types/firebase/db/space/spaceStructure';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { convertTimestampsToNumbers, revertTimestampConversion } from '../../../functions/db/dataFormatUtils';
import { SpaceInfoMap } from '../../../types/module/redux/space/spaceSliceTypes';

export const getSpaceInfo = (spaceId: string): Partial<SpaceInfoMap> => {
  const value = store.getState().spaceSlice.spaceInfoMap[spaceId];
  return value ? revertTimestampConversion(value) : {};
}

/**
 * ユーザーの所属チーム情報を自動更新する関数
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
export const autoUpdateSpaces = (dispatch: Dispatch, userId: string) => {
  const spaceService = serviceFactory.createSpaceService();
  const spaceMemberService = serviceFactory.createSpaceMemberService();

  const setFunc = (updatedData: SpaceData[]) => {
    const prevData = store.getState().spaceSlice.spaceInfoMap;
  
    const dataMap: TimestampConvertedDocumentMap<SpaceInfoMap> = updatedData.reduce((map, data) => {
      const existingData = prevData[data.docId] || {};
      
      // 既存のデータを保持しつつ、必要な部分だけを上書きする
      map[data.docId] = {
        ...existingData,
        space: convertTimestampsToNumbers(data),
      };
      
      return map;
    }, {} as TimestampConvertedDocumentMap<SpaceInfoMap>);
  
    dispatch(assignSpaceInfoMap({ ...prevData, ...dataMap }));
  };

  autoUpdateCollection(
    spaceService.baseDB,
    userId,
    spaceMemberService.filterNonMemberSpace.bind(spaceService),
    setFunc,
    setSpacesUpdateState,
    dispatch
  );
};
