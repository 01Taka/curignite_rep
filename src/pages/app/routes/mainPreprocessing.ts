import { getCurrentUser, getUserAuthState } from "../../../firebase/auth/auth";
import { usersDB } from "../../../firebase/db/dbs";
import { NavigateFunction } from "react-router-dom";
import { setUserInfo, UserDataState, UserInfoForRedux } from "../../../redux/slices/userDataSilce";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { convertTimestampToNumber } from "../../../functions/utils";
import { authPaths, rootPaths } from "../../../types/appPaths";

const mainPreprocessing = (
    navigate: NavigateFunction,
    dispatch: ThunkDispatch<{
        userDataSlice: UserDataState;
    }, undefined, UnknownAction> & Dispatch<UnknownAction>
) => {
    const verifiedProcess = async () => {
        try {
          const user = await getCurrentUser();
          const uid = user?.uid;
          if (uid) {
            // reduxにユーザーデータを設定
            const userInfo = await usersDB.read(uid);
            if (userInfo) {
              const userInfoForRedux: UserInfoForRedux = {
                uid,
                username: userInfo.username,
                birthDate: convertTimestampToNumber(userInfo.birthDate),
                createdAt: convertTimestampToNumber(userInfo.createdAt),
              }
              dispatch(setUserInfo(userInfoForRedux));
            }
          }
        } catch (error) {
          console.error("Error in verifiedProcess:", error);
          alert("An error occurred while verifying your account. Please try again.");
        }
      };
      
      const navigateByState = async () => {
        try {
          const state = await getUserAuthState();
          switch (state) {
            case "new":
              console.error('アカウントがありません');
              navigate(rootPaths.top);
              break;
            case "noUserData":
              console.error('サインアップが完了していません');
              navigate(authPaths.initialSetup);
              break;
            case "verified":
              await verifiedProcess();
              break;
            default:
              console.error('Unknown user state');
              navigate(rootPaths.top);
          }
        } catch (error) {
          console.error("Error in navigateByState:", error);
          alert("An error occurred while checking your authentication state. Please try again.");
        }
      };

      navigateByState();
}

export default mainPreprocessing;
