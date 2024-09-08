import { Avatar } from '@mui/material'
import React, { FC } from 'react'

interface AvatarViewProps {
  src: string | null;
  alt: string;
  avatarName: string;
}

const AvatarView: FC<AvatarViewProps> = ({ src, alt, avatarName }) => {
  return (
    <Avatar src={src || undefined} alt={alt} >
      {!src && avatarName[0]}
    </Avatar>
  )
}

export default AvatarView