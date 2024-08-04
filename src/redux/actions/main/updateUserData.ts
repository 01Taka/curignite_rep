import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserAuthState } from "../../../firebase/auth/auth";
import { setUserData, setRequestState } from "../../slices/userDataSlice";
import { authPaths, rootPaths } from "../../../types/path/appPaths";
import { RootState } from '../../../types/module/redux/reduxTypes';
import { convertTimestampsToNumbers } from '../../../functions/db/dbUtils';
import { AuthStates } from '../../../types/util/stateTypes';
import serviceFactory from '../../../firebase/db/factory';

export const updateUserData = createAsyncThunk<
  string | void,
  void,
  {
    state: RootState
  }
>(
  'user/updateUserData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setRequestState('loading'));  // リクエスト開始時の状態を設定

      const state = await getUserAuthState();
      const handleState = async (state: AuthStates) => {
        switch (state) {
          case "new":
            console.error('アカウントがありません');
            dispatch(setRequestState('notFound'));
            return rootPaths.top;
          case "noUserData":
            console.error('サインアップが完了していません');
            dispatch(setRequestState('notFound'));
            return authPaths.initialSetup;
          case "verified":
            const userService = serviceFactory.createUserService();
            const user = await userService.getCurrentUserData();
            if (user) {
              dispatch(setUserData(convertTimestampsToNumbers(user)));
              dispatch(setRequestState('success'));
            } else {
              dispatch(setRequestState('error'));
              throw new Error("User data not found.");
            }
            break;
          default:
            console.error('Unknown user state');
            dispatch(setRequestState('error'));
            return rootPaths.top;
        }
      };

      return await handleState(state);
    } catch (error) {
      console.error("Error in updateUserData:", error);
      dispatch(setRequestState('error'));  // エラー状態を設定
      return rejectWithValue("An error occurred while verifying your account. Please try again.");
    }
  }
);
