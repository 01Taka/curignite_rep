import React from 'react'
import TopPageView from './TopView';
import { useNavigate } from 'react-router-dom';
import { getUserAuthState } from '../../firebase/auth/auth';
import { authPaths, rootPaths } from '../../types/path/appPaths';

const TopPage: React.FC = () => {
    const navigate = useNavigate();

    const onSignUp = async () => {
        const state = await getUserAuthState();
        
        if (state === 'new') {
            navigate(rootPaths.auth);
        } else if (state ==='noUserData') {
            navigate(authPaths.initialSetup);
        } else {
            navigate(rootPaths.main);
        }
    }

    return (
        <TopPageView 
            onSignUp={onSignUp}
        />
    )
}

export default TopPage;
