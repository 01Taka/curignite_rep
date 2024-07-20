import { Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { AppSliceState, setIsMobile } from './redux/slices/appSlice';

const appPreprocessing = (
    dispatch: ThunkDispatch<{
    appSlice: AppSliceState;
}, undefined, UnknownAction> & Dispatch<UnknownAction>
) => {
  const updateDeviceMode = () => {
    const isMobile = window.innerWidth <= 768;
    dispatch(setIsMobile(isMobile));
  };

  updateDeviceMode();
};

export default appPreprocessing;
