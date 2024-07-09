import React, { FC } from 'react';
import ActionContainer from './actionContainer/ActionContainer';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditIcon from '@mui/icons-material/Edit';

interface JoinTeamViewProps {
    joinTeamValue: string;
    createTeamValue: string;
    onJoinTeamValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateTeamValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onJoinEnter: () => void;
    onCreateEnter: () => void;
}

const JoinTeamView: FC<JoinTeamViewProps> = ({
    joinTeamValue,
    createTeamValue,
    onJoinTeamValueChange,
    onCreateTeamValueChange,
    onJoinEnter,
    onCreateEnter,
}) => {
    return (
        <div>
            <div className='flex justify-center'>
                <ActionContainer
                    heading='チームに参加'
                    icon={<GroupAddIcon fontSize='inherit' />}
                    explanation='チームコードを入力してチームに参加します。'
                    label='コードを入力'
                    value={joinTeamValue}
                    enterText='参加する'
                    onValueChange={onJoinTeamValueChange}
                    onEnter={onJoinEnter}
                />
                <div className='px-8'/>
                <ActionContainer
                    heading='チームを作成'
                    icon={<EditIcon fontSize='inherit' />}
                    explanation='チーム名を入力して新しいチームを作成します。'
                    label='チーム名'
                    value={createTeamValue}
                    enterText='作成する'
                    onValueChange={onCreateTeamValueChange}
                    onEnter={onCreateEnter}
                />
            </div>
        </div>
    );
}

export default JoinTeamView;
