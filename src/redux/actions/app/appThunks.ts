import { isMobileMode } from "../../../functions/utils";
import { AppThunk } from "../../../types/module/reduxTypes";
import { setIsMobile } from "../../slices/appSlice";

// redux/thunks/appThunks.ts
export const initializeApp = (): AppThunk => (dispatch) => {
  const updateDeviceMode = () => {
    const isMobile = isMobileMode();
    dispatch(setIsMobile(isMobile));
  };

  // 初回のデバイスモード更新
  updateDeviceMode();

  // リサイズイベントリスナーの設定
  window.addEventListener('resize', updateDeviceMode);

  // クリーンアップ関数の返却
  return () => {
    window.removeEventListener('resize', updateDeviceMode);
  };
};
