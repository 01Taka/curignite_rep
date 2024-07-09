import React, { FC, useState } from 'react';
import JoinTeamView from './JoinTeamView';
import { useNavigate } from 'react-router-dom';

const JoinTeam: FC = () => {
    const navigate = useNavigate();
    const [joinTeamValue, setJoinTeamValue] = useState('');
    const [createTeamValue, setCreateTeamValue] = useState('');

    const handleJoinTeamValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setJoinTeamValue(event.target.value);
    }

    const handleCreateTeamValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateTeamValue(event.target.value);
    }

    const handleJoinEnter = () => {
        // チームに参加する処理をここに追加
        console.log('Joining team with code:', joinTeamValue);
    }

    const handleCreateEnter = () => {
        // チームを作成する処理をここに追加
        navigate(`/main/team/create/${createTeamValue}`);
        console.log('Creating team with name:', createTeamValue);
    }

    return (
        <JoinTeamView 
            joinTeamValue={joinTeamValue}
            createTeamValue={createTeamValue}
            onJoinTeamValueChange={handleJoinTeamValueChange}
            onCreateTeamValueChange={handleCreateTeamValueChange}
            onJoinEnter={handleJoinEnter}
            onCreateEnter={handleCreateEnter}
        />
    );
}

export default JoinTeam;
