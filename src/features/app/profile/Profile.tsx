import React, { useEffect, useState } from 'react'
import ProfileView from './ProfileView'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { uploadFile } from '../../../firebase/storage/upload';
import { setIconUrl } from '../../../redux/slices/studentDataSlice';

const Profile: React.FC = () => {
    const dispatch = useAppDispatch(); 
    const studentData = useAppSelector((state) => state.studentDataSlice);

    const [iconUrl, setIconLink] = useState("");
    const [username, setUserName] = useState("");
    const [grade, setGrade] = useState(0);
    const [classNumber, setClassNumber] = useState(0);
    const [joinedAt, setJoinedAt]= useState(0);
    const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);
    
    useEffect(() => {
      const setStudentInfo = async () => {
        setIsSignUpCompleted(false);

        if (studentData && studentData.signUpCompleted) {
          setIconLink(studentData.iconUrl);
          setUserName(studentData.name);
          setGrade(studentData.grade);
          setClassNumber(studentData.classNumber);
          setJoinedAt(studentData.joinedAt);
          setIsSignUpCompleted(true);
        }
      }
      setStudentInfo();
    }, [studentData]);

    const onIconChange = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  uploadFile('userIcons', studentData.uid, file);
                  const fileUrl = reader.result as string;
                  dispatch(setIconUrl(fileUrl));
                  setIconLink(fileUrl);
              };
              reader.readAsDataURL(file);
          }
      };
      fileInput.click();
  };
    
  return <ProfileView 
    iconUrl={iconUrl}
    username={username}
    grade={grade}
    classNumber={classNumber}
    joinedAt={joinedAt}
    isSignUpCompleted={isSignUpCompleted}
    onIconChange={onIconChange}
  />
}

export default Profile