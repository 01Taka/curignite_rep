import React, { useEffect } from "react";
import IndexPageView from "./IndexPageView";
import { getCurrentUser, getUserAuthState } from "../../../firebase/auth/auth";
import { getStudentInfo } from "../../../firebase/db/auth/users/getUser";
import { useAppDispatch } from "../../../redux/hooks";
import { resetStudentData, setAuthState, setStudentData, setUid } from "../../../redux/slices/studentDataSlice";
import { getFileUrl } from "../../../firebase/storage/get";
import { defaultIconUrl } from "../../../types/app/appTypes";
import { routeItems } from "./routing";
import { StudentDataState } from "../../../types/app/reduxStateTypes";

const IndexPage: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const setStudentDataToStore = async () => {
            dispatch(resetStudentData());
            const state = await getUserAuthState();
            dispatch(setAuthState(state));
            
            if (state === "new") {
                console.error('アカウントがありません');
            } else if (state === "signingUp") {
                const user = await getCurrentUser();
                const uid = user?.uid;
                if (uid) {
                    dispatch(setUid(uid));
                }
                console.error('サインアップが完了していません');
            } else {
                const user = await getCurrentUser();
                const uid = user?.uid;
                if (uid) {
                    const studentInfo = await getStudentInfo(uid);
                    let iconUrl: string = await getFileUrl("userIcons", uid);

                    if (!iconUrl) {
                        iconUrl = defaultIconUrl;
                    }
                    
                    if (studentInfo) {
                        const studentData: StudentDataState = {
                            authState: state,
                            uid: uid,
                            iconUrl: iconUrl,
                            name: studentInfo.username,
                            grade: studentInfo.grade,
                            classNumber: studentInfo.classNumber,
                            joinedAt: studentInfo.joinedAt.toMillis(),
                            signUpCompleted: true,
                        }
                        dispatch(setStudentData(studentData));
                    }
                } else {
                    console.error("uidが取得できませんでした。");
                }
            }
        }
        setStudentDataToStore();
    }, [dispatch]);

    return <IndexPageView 
        routeItems={routeItems}
    />
}

export default IndexPage;
