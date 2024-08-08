import React from 'react'
import TopPageView from './TopView';
import { useNavigate } from 'react-router-dom';
import serviceFactory from '../../firebase/db/factory';
import { useAppSelector } from '../../redux/hooks';
import { rootPaths } from '../../types/path/paths';
import { authPaths } from '../../types/path/authPaths';

const TopPage: React.FC = () => {
    const navigate = useNavigate();
    const { uid } = useAppSelector(state => state.userSlice);

    const onSignUp = async () => {
        if (!uid) {
            navigate(rootPaths.auth);
            return;
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
