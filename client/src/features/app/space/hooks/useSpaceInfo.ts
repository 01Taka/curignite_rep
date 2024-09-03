import { useSelector } from 'react-redux';
import { RootState } from '../../../../types/module/redux/reduxTypes';
import { getSpaceInfo } from '../../../../redux/actions/space/spaceActions';
import { revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import { dictToArray } from '../../../../functions/objectUtils';
import { SpaceData } from '../../../../types/firebase/db/space/spaceStructure';

export const useCurrentSpaceInfo = () => {
  return useSelector((state: RootState) => {
    return getSpaceInfo(state.spaceSlice.currentSpaceId);
  });
};

export const useSpaces = (): SpaceData[] => {
  return useSelector((state: RootState) => {
    const spaceInfoMap = state.spaceSlice.spaceInfoMap;
    const convertedData = revertTimestampConversion(spaceInfoMap);
    const spacesArray = dictToArray(convertedData);
    return spacesArray.map(info => info.space).filter((space): space is SpaceData => space !== null);
  });
};