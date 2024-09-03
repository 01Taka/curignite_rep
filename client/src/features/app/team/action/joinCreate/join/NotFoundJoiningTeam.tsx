import { SearchOff } from '@mui/icons-material'
import { Typography } from '@mui/material'
import React, { FC } from 'react'

const NotFoundJoiningTeam: FC = () => {
  return (
    <div className='flex flex-col justify-center p-4 space-y-6 h-full'>
      <div className='flex justify-between space-x-4'>
        <Typography variant='h4'>
          チームが見つかりませんでした。
        </Typography>
        <div className='pr-2'>
          <SearchOff style={{ width: "64px", height: "64px"}}/>
        </div>
      </div>
      
      <Typography variant='body1'>
        このコードは有効ではありません。<br />
        コードにミスがないかを確認したうえで、
        もう一度お試しください。
      </Typography>
    </div>
  )
}

export default NotFoundJoiningTeam