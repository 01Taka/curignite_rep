import React, { FC } from 'react'
import CircularButton from '../../../../components/input/button/CircularButton';

interface TeamHomeViewProps {
    toJoinCreatePage: () => void;
}

const TeamHomeView: FC<TeamHomeViewProps> = ({ toJoinCreatePage }) => {
  return (
    <div>
        <CircularButton size="xl" bgColor="main" onClick={toJoinCreatePage}>
            チーム<br/>参加/作成
        </CircularButton>
    </div>
  )
}

export default TeamHomeView