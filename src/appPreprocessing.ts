import { Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { AppSliceState, setIsMobile } from './redux/slices/appSlice';

const appPreprocessing = (
    dispatch: ThunkDispatch<{
    appSlice: AppSliceState;
}, undefined, UnknownAction> & Dispatch<UnknownAction>
) => {
  // デバイスモードを更新する関数
  const updateDeviceMode = () => {
    const isMobile = window.innerWidth <= 768;
    dispatch(setIsMobile(isMobile));
  };

  // 初回のデバイスモード更新
  updateDeviceMode();

  // リサイズイベントリスナーの設定
  window.addEventListener('resize', updateDeviceMode);

  // クリーンアップ関数
  return () => {
    window.removeEventListener('resize', updateDeviceMode);
  };
};

export default appPreprocessing;
