import React from 'react'
import StudentDataView from '../../../../components/app/profile/StudentInfoView';

interface ProfileViewProps {
    username: string;
    iconUrl: string;
    grade: number;
    classNumber: number;
    joinedAt: number;
    isSignUpCompleted: boolean;
    onIconChange: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
    username,
    iconUrl,
    grade,
    classNumber,
    joinedAt,
    isSignUpCompleted,
    onIconChange,
}) => {
  return (
    <div className='h-full'>
        {isSignUpCompleted && joinedAt &&
          <div>
          <StudentDataView
            iconUrl={iconUrl}
            username={username}
            grade={grade}
            classNumber={classNumber}
            joinedAt={joinedAt}
            onIconChange={onIconChange}
            />
        </div>
        }
    </div>
  )
}

export default ProfileView