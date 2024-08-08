import React, { FC, useState } from 'react';
import JoinCreateTeamView from '../../../../features/app/team/action/joinCreate/JoinCreateTeamView';
import { useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam } from '../../../../types/path/paths';

const JoinCreateTeam: FC = () => {
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
        navigate(replaceParams(teamPaths.create, { [PathParam.Name]: createTeamValue }));
        console.log('Creating team with name:', createTeamValue);
    }

    return (
        <JoinCreateTeamView
            joinTeamValue={joinTeamValue}
            createTeamValue={createTeamValue}
            onJoinTeamValueChange={handleJoinTeamValueChange}
            onCreateTeamValueChange={handleCreateTeamValueChange}
            onJoinEnter={handleJoinEnter}
            onCreateEnter={handleCreateEnter}
        />
    );
}

export default JoinCreateTeam;
