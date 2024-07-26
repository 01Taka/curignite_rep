import { getCurrentUser, getUserAuthState } from "../../../firebase/auth/auth";
import { usersDB } from "../../../firebase/db/dbs";
import { NavigateFunction } from "react-router-dom";
import { setUserData, UserDataState } from "../../../redux/slices/userDataSilce";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { authPaths, rootPaths } from "../../../types/path/appPaths";
import { serializeUserData } from "../../../functions/serialization/user/userSerialization";

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
            const userData = await usersDB.read(uid);
            if (userData) {
              dispatch(setUserData(serializeUserData(userData)));
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
