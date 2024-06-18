import React from 'react'

interface PosterInfoProps {
    iconUrl: string;
    username: string;
    grade: string;
    postDateStr: string;
}

const PosterInfo: React.FC<PosterInfoProps> = ({
    iconUrl,
    username,
    grade,
    postDateStr,
}) => {
  return (
    <div>
        <img width={65} height={65} src={iconUrl} alt="user icon" />
        <div>
            <div>
                <p>{grade}</p>
                <p>{username}</p>
            </div>
            <p>{postDateStr}</p>
        </div>
    </div>
  )
}

export default PosterInfo