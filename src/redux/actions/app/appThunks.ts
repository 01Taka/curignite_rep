// redux/thunks/appThunks.ts
import { AppThunk } from "../../../types/module/redux/reduxTypes";
import { updateUserState } from "../user/updateUserState";

export const initializeApp = (): AppThunk => async (dispatch) => {
  try {
    await dispatch(updateUserState());
  } catch (error) {
    console.error("Failed to initialize app:", error);
    // 必要に応じてエラー処理を追加
  }
};
