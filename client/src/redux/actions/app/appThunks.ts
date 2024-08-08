import { AppDispatch, AppThunk } from "../../../types/module/redux/reduxTypes";
import { Device } from "../../../types/util/stateTypes";
import { setUserDevice } from "../../slices/user/userSlice";
import { updateUserData } from "../user/updateUserState";

export const handleUpdateDevice = (dispatch: AppDispatch) => {
  const updateDevice = () => {
    const device: Device = window.innerWidth <= 768 ? "mobile" : "desktop";
    dispatch(setUserDevice(device));
  }

  window.addEventListener('resize', updateDevice);

  return () => window.removeEventListener('resize', updateDevice);
};

export const initializeApp = (): AppThunk => async (dispatch) => {
  try {
    await dispatch(updateUserData());
    handleUpdateDevice(dispatch as AppDispatch);
  } catch (error) {
    console.error("Failed to initialize app:", error);
    // 必要に応じてエラー処理を追加
  }
};
