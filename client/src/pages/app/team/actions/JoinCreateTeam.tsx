import React, { FC, useCallback, useState } from 'react';
import JoinCreateTeamView from '../../../../features/app/team/action/joinCreate/JoinCreateTeamView';
import { useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam } from '../../../../types/path/paths';
import serviceFactory from '../../../../firebase/db/factory';
import Popup from '../../../../components/util/Popup';
import { CircularProgress } from '@mui/material';
import NotFoundJoiningTeam from '../../../../features/app/team/action/joinCreate/join/NotFoundJoiningTeam';
import JoiningTeam from '../../../../features/app/team/action/joinCreate/join/JoiningTeam';
import { useAppSelector } from '../../../../redux/hooks';
import { TeamData } from '../../../../types/firebase/db/team/teamStructure';

const JoinCreateTeam: FC = () => {
    const navigate = useNavigate();
    const uid = useAppSelector(state => state.userSlice.uid);

    const [teamCodeId, setTeamCodeId] = useState('');
    const [createTeamName, setCreateTeamName] = useState('');
    const [popupState, setPopupState] = useState<"open" | "close" | "loading">("close");
    const [joiningTeam, setJoiningTeam] = useState<TeamData | null>(null);

    const handleTeamCodeIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamCodeId(event.target.value);
    }

    const handleCreateTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateTeamName(event.target.value);
    }

    const handleJoinEnter = useCallback(async () => {
        try {
          setPopupState('loading');
          const teamService = serviceFactory.createTeamService();
          const team = await teamService.getTeamDataWithTeamCodeId(teamCodeId);
          setJoiningTeam(team);
          setPopupState('open');
        } catch (error) {
          console.error('Failed to join team:', error);
          setPopupState('open');
          setJoiningTeam(null);
        }
      }, [teamCodeId]);
    
      const handleCreateEnter = useCallback(() => {
        if (createTeamName.trim()) {
          navigate(replaceParams(teamPaths.create, { [PathParam.Name]: createTeamName }));
          console.log('Creating team with name:', createTeamName);
        }
      }, [createTeamName, navigate]);

    const handleClosePopup = () => {
        setPopupState("close");
    }

    const onJoined = () => {
        handleClosePopup();
        setTeamCodeId("");
    }

    return (
        <>
            <JoinCreateTeamView
                teamCodeId={teamCodeId}
                createTeamName={createTeamName}
                onTeamCodeIdChange={handleTeamCodeIdChange}
                onCreateTeamNameChange={handleCreateTeamNameChange}
                onJoinEnter={handleJoinEnter}
                onCreateEnter={handleCreateEnter}
            />
            <Popup open={popupState !== "close"} handleClose={handleClosePopup}>
                <div className='h-96'>
                    {popupState === "loading" ? (
                        <CircularProgress />
                    ) : (joiningTeam && uid ? (
                        <JoiningTeam team={joiningTeam} codeId={teamCodeId} uid={uid} onCancel={handleClosePopup} onJoined={onJoined} />
                    ) : (
                        <NotFoundJoiningTeam />
                    ))}
                </div>
            </Popup>
        </>
    );
}

export default JoinCreateTeam;
