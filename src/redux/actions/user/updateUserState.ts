import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { setUserData, setRequestState } from '../../slices/user/userSlice';
import { RootState } from '../../../types/module/redux/reduxTypes';
import { convertTimestampsToNumbers } from '../../../functions/db/dbUtils';
import { SerializableUserData } from '../../../types/firebase/db/user/usersTypes';
import serviceFactory from '../../../firebase/db/factory';

export const updateUserState = createAsyncThunk<
  string | void,
  void,
  {
    state: RootState
  }
>(
  'user/updateUserData',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setRequestState('loading')); // ロード状態に設定

    try {
      const auth = getAuth();
      const user = await new Promise<User | null>((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        }, reject);
      });

      if (!user) {
        dispatch(setRequestState('notFound')); // ユーザーが見つからなかった状態に設定
        return rejectWithValue("User not authenticated");
      }

      const userId = user.uid;
      const userService = serviceFactory.createUserService();
      const userData = await userService.getUserData(userId);

      if (!userData) {
        dispatch(setRequestState('notFound')); // ユーザーデータが見つからなかった状態に設定
        return rejectWithValue("User data not found");
      }

      // タイムスタンプの変換
      const convertedUserData: SerializableUserData = convertTimestampsToNumbers(userData);

      // ユーザーデータをストアに保存
      dispatch(setUserData(convertedUserData));
      dispatch(setRequestState('success')); // 成功状態に設定

      return "User data updated successfully";
    } catch (error) {
      console.error("Error in updateUserState:", error);
      dispatch(setRequestState('error')); // エラー状態を設定
      return rejectWithValue("An error occurred while verifying your account. Please try again.");
    }
  }
);
