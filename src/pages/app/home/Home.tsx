import React, { useEffect } from "react";
import HomeView from "./HomeView";
import { getCurrentUser } from "../../../firebase/auth/signIn";
import { checkIfExistUidInDB, getStudentInfo } from "../../../firebase/db/auth/users/getUser";
import { useAppDispatch } from "../../../redux/hooks";
import { resetStudentData, setStudentData, setUid } from "../../../redux/slices/studentDataSlice";
import { getFileUrl } from "../../../firebase/storage/get";
import { defaultIconUrl } from "../../../types/app/appTypes";
import { routeItems } from "./routing";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const setStudentDataToStore = async () => {
            dispatch(resetStudentData());
            const user = await getCurrentUser();

            if (user) {
                const uid = user.uid;
                const state = await checkIfExistUidInDB(uid);
                if (!state) {
                    dispatch(setUid(uid));
                    console.error('サインアップが完了していません');
                } else {
                    const studentInfo = await getStudentInfo(uid);
                    let iconUrl: string = await getFileUrl("userIcons", uid);

                    if (!iconUrl) {
                        iconUrl = defaultIconUrl;
                    }
                    
                    if (studentInfo) {
                        const studentData = {
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
                }
            } else {
                console.error('アカウントがありません');
            }
        }
        setStudentDataToStore();
    }, [dispatch]);

    return <HomeView 
        routeItems={routeItems}
    />
}

export default Home;
