import { createAsyncThunk } from '@reduxjs/toolkit';
import serviceFactory from "../../../firebase/db/factory";
import { setSpaces } from '../../slices/space/spaceSlice';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { SpaceData } from '../../../types/firebase/db/space/spacesTypes';
import { arrayToDictWithTimestampToNumbers } from '../../../functions/db/dataFormatUtils';

export const fetchSpaces = createAsyncThunk<
  AsyncThunkState<TimestampConvertedDocumentMap<SpaceData>>,
  string,
  { rejectValue: string }
>("space/fetchSpaces", async (userId, { dispatch, rejectWithValue }) => {
  try {
    const spaceService = serviceFactory.createSpaceService();
    const spacesData = await spaceService.getSameTeamMembersSpaceData(userId);
    if (!spacesData) {
      const errorMessage = "Spaces not found";
      return rejectWithValue(errorMessage);
    }
    const convertedSpaces = arrayToDictWithTimestampToNumbers(spacesData);
    dispatch(setSpaces(convertedSpaces));
    return { state: "success", value: convertedSpaces };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage);
  }
});
