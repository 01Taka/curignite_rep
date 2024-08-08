import { Skeleton } from '@mui/material'
import React, { FC } from 'react'

interface TeamSkeletonProps {
  length?: number;
}

const TeamSkeleton: FC<TeamSkeletonProps> = ({ length = 3 }) => {
  return (
    <div className='w-11/12 mt-8'>
      {Array.from({ length }, (_, index) => (
        <Skeleton key={`skeleton-${index}`} className='rounded-lg my-4' variant="rectangular" height={70} />
      ))}
    </div>
  )
}

export default TeamSkeleton