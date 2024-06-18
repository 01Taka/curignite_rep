import React from 'react'
import TopPageView from './TopView';
import { useNavigate } from 'react-router-dom';
import { getUserAuthState } from '../../../firebase/auth/auth';

const TopPage: React.FC = () => {
    const navigate = useNavigate();

    const onSignUp = async () => {
        const state = await getUserAuthState();
        if (state === "new") {
            navigate("/signup");
        } else if (state ==="signingUp") {
            navigate("/user-initial-setup");
        } else {
            navigate("/home")
        }
    }

    return (
        <TopPageView 
            onSignUp={onSignUp}
        />
    )
}

export default TopPage;
