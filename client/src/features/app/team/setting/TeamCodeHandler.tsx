import React, { FC, useEffect, useState, useCallback } from 'react';
import serviceFactory from '../../../../firebase/db/factory';
import { TimeTypes } from '../../../../types/util/dateTimeTypes';
import { useAppSelector } from '../../../../redux/hooks';
import { Alert, Divider, Typography } from '@mui/material';
import CircularButton from '../../../../components/input/button/CircularButton';
import DateField from '../../../../components/input/field/DateField';
import { FormStateChangeEvent } from '../../../../types/util/componentsTypes';
import CopyButton from '../../../../components/input/button/CopyButton';
import { dateTimeToString } from '../../../../functions/dateTimeUtils';
import { TeamCodeData } from '../../../../types/firebase/db/team/teamCodeStructure';
import { TeamData } from '../../../../types/firebase/db/team/teamStructure';

interface TeamCodeHandlerProps {
  team: TeamData;
}

const TeamCodeHandler: FC<TeamCodeHandlerProps> = ({ team }) => {
  const { uid } = useAppSelector(state => state.userSlice);
  const [joinCode, setJoinCode] = useState<TeamCodeData | null>(null);
  const [newCodePeriod, setNewCodePeriod] = useState<TimeTypes | undefined>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reissuedCode, setReissuedCode] = useState(false);

  const updateCurrentCode = useCallback(async () => {
    try {
      if (team) {
        const codeService = serviceFactory.createTeamCodeService();
        const code = await codeService.getTeamCodeByTeamId(team.docId);
        setJoinCode(code);
      }
    } catch (error) {
      console.error('Error fetching current team code:', error);
      setError("チームコードの取得に失敗しました。");
    }
  }, [team]);

  useEffect(() => {
    updateCurrentCode();
  }, [updateCurrentCode]);

  const reissueTeamCode = async () => {
    setMessage("");
    setError("");
    try {
      if (uid && team && newCodePeriod) {
        const codeService = serviceFactory.createTeamCodeService();
        await codeService.createTeamCode(uid, team.docId, newCodePeriod);
        await updateCurrentCode();
        setReissuedCode(true);
        setMessage("新しい参加コードが発行されました。");
      } else {
        setError("全てのフィールドを正しく入力してください。");
      }
    } catch (error) {
      console.error('Error reissuing team code:', error);
      setError("参加コードの再発行に失敗しました。");
    }
  };

  const stopCode = async () => {
    setMessage("");
    setError("");
    try {
      if (joinCode) {
        const codesDB = serviceFactory.createTeamCodeService();
        await codesDB.softDeleteTeamCode(joinCode.docId);
        setJoinCode(null);
        setMessage("参加コードが停止されました。");
      } else {
        setError("停止するコードがありません。");
      }
    } catch (error) {
      console.error('Error stopping team code:', error);
      setError("参加コードの停止に失敗しました。");
    }
  };

  return (
    <>
      <div className='flex items-center ml-6'>
        <div className='flex flex-col justify-center'>
          <Typography variant='h6'>
            チームへの参加コード
          </Typography>
          {(joinCode && joinCode.valid) ? (
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <Typography className='p-1 bg-secondaryBase rounded-md'>{joinCode.docId}</Typography>
                <CopyButton textToCopy={joinCode.docId} tooltipMessage='コードをコピー'/>
              </div>
              {joinCode.period && 
                <Typography>
                  {dateTimeToString(joinCode.period, { isAbsolute: true, format: "yyyy年 MM/dd"})}まで
                </Typography>
              }
            </div>
          ) : (
            <Typography color="GrayText">コードがありません。</Typography>
          )}
        </div>
        {(joinCode && joinCode.valid) && 
          <div className='flex flex-col items-center ml-auto mr-4'>
              <Typography variant='caption'>コードを停止</Typography>
              <CircularButton onClick={stopCode} className='mx-2 hover:bg-red-400' size="sm" >停止</CircularButton>
          </div>
        }
      </div>

      <Divider className='py-1'/>
      
      {!reissuedCode && 
        <div className='flex flex-col mt-4 ml-3'>
          <Typography>新しいコードを発行する：</Typography>
          <div className='flex'>
            <div className='mx-2'>
              <DateField label='期限' name='period' onChange={(e: FormStateChangeEvent) => setNewCodePeriod(e.target.value as TimeTypes)} />
            </div>
            <CircularButton onClick={reissueTeamCode} className='hover:bg-green-400'>発行</CircularButton>
          </div>
          <Typography variant="caption">＊前のコードは使えなくなります。</Typography>
        </div>
      }

      {(message || error) &&
        <div className='mt-4 mx-auto'>
          {message && <Alert severity='success'>{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </div>
      }
    </>
  );
};

export default TeamCodeHandler;
