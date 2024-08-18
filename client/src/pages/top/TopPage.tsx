import React from 'react'
import TopPageView from './TopView';
import { useNavigate } from 'react-router-dom';
import serviceFactory from '../../firebase/db/factory';
import { rootPaths } from '../../types/path/paths';
import { authPaths } from '../../types/path/authPaths';
import { getAuth } from 'firebase/auth';

const TopPage: React.FC = () => {
    const navigate = useNavigate();

    const onSignUp = async () => {
        const uid = getAuth().currentUser?.uid || null;

        if (!uid) {
            navigate(rootPaths.auth);
        }

        const userService = serviceFactory.createUserService();
        const state = await userService.getUserAuthState(uid);

        switch (state) {
            case "new":
                navigate(rootPaths.auth);
                break;
            case "noUserData":
                navigate(authPaths.initialSetup);
                break;
            case "verified":
                navigate(rootPaths.main);
                break;
            default:
                console.error("一致する認証状態がありません。");
                break;
        }
    }

    return (
        <TopPageView 
            onSignUp={onSignUp}
        />
    )
}

export default TopPage;
