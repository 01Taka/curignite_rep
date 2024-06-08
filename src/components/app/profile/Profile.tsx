import React, { useEffect, useState } from 'react'
import ProfileView from './ProfileView'
import { getCurrentUser } from '../../../firebase/auth/signIn';
import { auth } from '../../../firebase/firebase';
import { getUserData } from '../../../firebase/db/users/getUser';

const Profile: React.FC = () => {
    const [username, setUserName] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    
    useEffect(() => {
        setUserInfo();
    }, [auth]);

    const setUserInfo = async () => {
        const user = await getCurrentUser();
        if (user) {
            const uid = user.uid;
            getUserData(uid);
        }
        console.log(user);
    }
    
    
  return <ProfileView 
    usename={username}
    iconUrl={iconUrl}
  />
}

export default Profile