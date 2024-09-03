import { Typography } from '@mui/material'
import React, { FC } from 'react'
import CircularButton from '../../../../../components/input/button/CircularButton'

const SpaceMoveDialog: FC = () => {
  return (
    <div className='flex flex-col space-y-2 mx-auto mt-4 max-w-sm'>
    <Typography variant='h5'>
      スペースを移動
    </Typography>
    <Typography>
      このスペースを一時的に離席して他のスペースに移動しますか？
    </Typography>
    <CircularButton onClick={() => {}} bgColor="main" size="lg" className='self-end'>
      移動する
    </CircularButton>
  </div>
  )
}

export default SpaceMoveDialog