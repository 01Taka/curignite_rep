import React, { useEffect } from "react";
import HomeView from "./HomeView";
import { getCurrentUser } from "../../../firebase/auth/signIn";
import { checkIfExistUidInDB, getStudentInfo } from "../../../firebase/db/auth/users/getUser";
import { HomeRouteItem } from "../../../types/app/home";
import Profile from "../../../features/app/profile/Profile";
import CreateQuestion from "../../../features/app/question/createQuestion/CreateQuestion";
import { useAppDispatch } from "../../../redux/hooks";
import { resetStudentData, setStudentData, setUid } from "../../../redux/slices/studentDataSlice";
import QuestionList from "../../../features/app/question/questionList/QuestionList";
import { getFileUrl } from "../../../firebase/storage/get";
import { defaultIconUrl } from "../../../types/app/appTypes";

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


    const routeItems: HomeRouteItem[] = [
        {path: 'profile', element: <Profile />},
        {path: 'question', element: <CreateQuestion />},
        {path: 'answer', element: <QuestionList />},
    ]

    return <HomeView 
        routeItems={routeItems}
    />
}

export default Home;
