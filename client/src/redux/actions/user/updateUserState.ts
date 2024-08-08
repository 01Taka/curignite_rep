import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { convertTimestampsToNumbers } from '../../../functions/db/dbUtils';
import { SerializableUserData } from '../../../types/firebase/db/user/usersTypes';
import serviceFactory from '../../../firebase/db/factory';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { fulfillWithState } from '../../../functions/redux/reduxUtils';

export const updateUserData = createAsyncThunk<
  AsyncThunkState<SerializableUserData | null>,
  void,
  { rejectValue: string }
>(
  'user/updateUserData',
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const user = await new Promise<User | null>((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        }, reject);
      });

      if (!user) {
        return rejectWithValue("User not authenticated");
      }

      const userId = user.uid;
      const userService = serviceFactory.createUserService();
      const userData = await userService.getUserData(userId);

      if (!userData) {
        return rejectWithValue("User data not found");
      }

      // タイムスタンプの変換
      const convertedUserData: SerializableUserData = convertTimestampsToNumbers(userData);
      return fulfillWithState(convertedUserData);
    } catch (error) {
      console.error("Error in updateUserState:", error);
      return rejectWithValue("An error occurred while verifying your account. Please try again.");
    }
  }
);
