import React, { FC, useCallback, useState } from 'react';
import JoinCreateTeamView from '../../../../features/app/team/action/joinCreate/JoinCreateTeamView';
import { useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam } from '../../../../types/path/paths';
import serviceFactory from '../../../../firebase/db/factory';
import Popup from '../../../../components/util/Popup';
import { TeamData } from '../../../../types/firebase/db/team/teamsTypes';
import { CircularProgress } from '@mui/material';
import NotFoundJoiningTeam from '../../../../features/app/team/action/joinCreate/join/NotFoundJoiningTeam';
import JoiningTeam from '../../../../features/app/team/action/joinCreate/join/JoiningTeam';
import { useAppSelector } from '../../../../redux/hooks';

const JoinCreateTeam: FC = () => {
    const navigate = useNavigate();
    const uid = useAppSelector(state => state.userSlice.uid);

    const [joinTeamValue, setJoinTeamValue] = useState('');
    const [createTeamValue, setCreateTeamValue] = useState('');
    const [popupState, setPopupState] = useState<"open" | "close" | "loading">("close");
    const [joiningTeam, setJoiningTeam] = useState<TeamData | null>(null);

    const handleJoinTeamValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setJoinTeamValue(event.target.value);
    }

    const handleCreateTeamValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateTeamValue(event.target.value);
    }

    const handleJoinEnter = useCallback(async () => {
        try {
          setPopupState('loading');
          const codeService = serviceFactory.createTeamCodeService();
          const team = await codeService.validateTeamCode(joinTeamValue);
          setJoiningTeam(team);
          setPopupState('open');
        } catch (error) {
          console.error('Failed to join team:', error);
          setPopupState('open');
          setJoiningTeam(null);
        }
      }, [joinTeamValue]);
    
      const handleCreateEnter = useCallback(() => {
        if (createTeamValue.trim()) {
          navigate(replaceParams(teamPaths.create, { [PathParam.Name]: createTeamValue }));
          console.log('Creating team with name:', createTeamValue);
        }
      }, [createTeamValue, navigate]);

    const handleClosePopup = () => {
        setPopupState("close");
    }

    const onJoined = () => {
        handleClosePopup();
        setJoinTeamValue("");
    }

    return (
        <>
            <JoinCreateTeamView
                joinTeamValue={joinTeamValue}
                createTeamValue={createTeamValue}
                onJoinTeamValueChange={handleJoinTeamValueChange}
                onCreateTeamValueChange={handleCreateTeamValueChange}
                onJoinEnter={handleJoinEnter}
                onCreateEnter={handleCreateEnter}
            />
            <Popup open={popupState !== "close"} handleClose={handleClosePopup}>
                <div className='h-96'>
                    {popupState === "loading" ? (
                        <CircularProgress />
                    ) : (joiningTeam && uid ? (
                        <JoiningTeam team={joiningTeam} code={joinTeamValue} uid={uid} onCancel={handleClosePopup} onJoined={onJoined} />
                    ) : (
                        <NotFoundJoiningTeam />
                    ))}
                </div>
            </Popup>
        </>
    );
}

export default JoinCreateTeam;
