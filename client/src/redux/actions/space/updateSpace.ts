import { createAsyncThunk } from '@reduxjs/toolkit';
import serviceFactory from "../../../firebase/db/factory";
import { spaceStorage } from "../../../functions/localStorage/storages";
import { convertTimestampsToNumbers } from '../../../functions/db/dbUtils';
import { setCurrentSpace, setSpaces } from '../../slices/space/spaceSlice';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { SerializableSpaceData } from '../../../types/firebase/db/space/spacesTypes';

export const fetchAndSetCurrentSpace = createAsyncThunk<
  AsyncThunkState<SerializableSpaceData | null>,
  void,
  { rejectValue: string }
>('space/fetchAndSetCurrentSpace', async (_, { dispatch, rejectWithValue }) => {
  const spaceId = spaceStorage.getData("currentSpaceId");
  if (!spaceId) {
    const errorMessage = "Space ID is missing";
    return rejectWithValue(errorMessage);
  }

  const spacesDB = serviceFactory.getSpacesDB();
  try {
    const space = await spacesDB.getSpace(spaceId);
    if (!space) {
      const errorMessage = "Space not found";
      return rejectWithValue(errorMessage);
    }
    const convertedSpace = convertTimestampsToNumbers(space);
    dispatch(setCurrentSpace(convertedSpace));
    return { state: "success", value: convertedSpace };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage);
  }
});

export const fetchSpaces = createAsyncThunk<
  AsyncThunkState<SerializableSpaceData[]>,
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
    const convertedSpaces = convertTimestampsToNumbers(spacesData);
    dispatch(setSpaces(convertedSpaces));
    return { state: "success", value: convertedSpaces };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage);
  }
});
