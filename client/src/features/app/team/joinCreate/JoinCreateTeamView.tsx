import React, { FC } from 'react';
import ActionContainer from './ActionContainer';

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditIcon from '@mui/icons-material/Edit';

interface JoinCreateTeamViewProps {
    teamCodeId: string;
    createTeamName: string;
    onTeamCodeIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateTeamNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onJoinEnter: () => void;
    onCreateEnter: () => void;
}

const JoinCreateTeamView: FC<JoinCreateTeamViewProps> = ({
    teamCodeId,
    createTeamName,
    onTeamCodeIdChange,
    onCreateTeamNameChange,
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
                    value={teamCodeId}
                    enterText='参加する'
                    onValueChange={onTeamCodeIdChange}
                    onEnter={onJoinEnter}
                />
                <div className='px-8'/>
                <ActionContainer
                    heading='チームを作成'
                    icon={<EditIcon fontSize='inherit' />}
                    explanation='チーム名を入力して新しいチームを作成します。'
                    label='チーム名'
                    value={createTeamName}
                    enterText='作成する'
                    onValueChange={onCreateTeamNameChange}
                    onEnter={onCreateEnter}
                />
            </div>
        </div>
    );
}

export default JoinCreateTeamView;
