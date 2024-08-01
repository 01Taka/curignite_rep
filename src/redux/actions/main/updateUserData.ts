import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, getUserAuthState } from "../../../firebase/auth/auth";
import { usersDB } from "../../../firebase/db/dbs";
import { setUserData } from "../../slices/userDataSilce";
import { serializeUserData } from "../../../functions/serialization/user/userSerialization";
import { authPaths, rootPaths } from "../../../types/path/appPaths";
import { RootState } from '../../../types/module/redux/reduxTypes';

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
      const state = await getUserAuthState();
      switch (state) {
        case "new":
          console.error('アカウントがありません');
          return rootPaths.top;
        case "noUserData":
          console.error('サインアップが完了していません');
          return authPaths.initialSetup;
        case "verified":
          const user = await getCurrentUser();
          const uid = user?.uid;
          if (uid) {
            const userData = await usersDB.getUser(uid);
            if (userData) {
              dispatch(setUserData(serializeUserData(userData)));
            }
          }
          break;
        default:
          console.error('Unknown user state');
          return rootPaths.top;
      }
    } catch (error) {
      console.error("Error in updateUserData:", error);
      return rejectWithValue("An error occurred while verifying your account. Please try again.");
    }
  }
);
