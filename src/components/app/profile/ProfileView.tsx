import React from 'react'

interface ProfileViewProps {
    usename: string;
    iconUrl: string;
}

const ProfileView: React.FC<ProfileViewProps> = ({
    usename,
    iconUrl,
}) => {
  return (
    <div>
        <div>
            <img src={iconUrl} alt="アイコン画像" />
            <p>{usename}</p>
        </div>
    </div>
  )
}

export default ProfileView