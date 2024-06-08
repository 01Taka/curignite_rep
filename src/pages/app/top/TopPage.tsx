import React from 'react'
import TopPageView from './TopView';
import { useNavigate } from 'react-router-dom';

const TopPage: React.FC = () => {
    const navigate = useNavigate();

    const onSignUp = () => {
        navigate("/signup")
    }

    return (
        <TopPageView 
            onSignUp={onSignUp}
        />
    )
}

export default TopPage;
