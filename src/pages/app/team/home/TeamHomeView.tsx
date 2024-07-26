import React, { FC } from 'react'
import CircularButton from '../../../../components/input/button/CircularButton';

interface TeamHomeViewProps {
    toJoinPage: () => void;
}

const TeamHomeView: FC<TeamHomeViewProps> = ({ toJoinPage }) => {
  return (
    <div>
        <CircularButton size="xl" bgColor="main" onClick={toJoinPage}>
            チーム<br/>参加/作成
        </CircularButton>
    </div>
  )
}

export default TeamHomeView