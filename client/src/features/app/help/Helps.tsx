import React, { FC, useEffect, useState } from 'react';
import serviceFactory from '../../../firebase/db/factory';
import { useAppSelector } from '../../../redux/hooks';
import SubjectIcon from '../../../components/util/SubjectIcon';
import { Button, IconButton, Typography } from '@mui/material';
import Popup from '../../../components/util/Popup';
import CreateHelpForm from './CreateHelpForm';
import FilePreview from '../../../components/util/FilePreview';
import { storageManager } from '../../../firebase/storage/storageManager';
import { HelpAndAnswersWithFileUrls, HelpAnswerData } from '../../../types/firebase/db/user/userStructure';
import { cn } from '../../../functions/utils';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AnswersView from './AnswersView';

const Helps: FC = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [helpWithAnswersList, setHelpWithAnswersList] = useState<HelpAndAnswersWithFileUrls[]>([]);
  const [openHelpForm, setOpenHelpForm] = useState(false);
  const [showHelpList, setShowHelpList] = useState(false); // HELP 一覧の表示トグル用

  useEffect(() => {
    const fetchHelpData = async () => {
      if (uid) {
        const helpService = serviceFactory.createUserHelpService();
        const list = await helpService.getAllHelpAndAnswersWithFileUrls(uid);
        const listWithFileUrls = await Promise.all(
          list.map(async (data) => {
            const helpFileUrls = await storageManager.getFileUrls(data.helpFileUrls);
            const answersFileUrls = await Promise.all(
              Object.keys(data.answersFileUrls).map(async (key) => {
                const urls = await storageManager.getFileUrls(data.answersFileUrls[key]);
                return { [key]: urls };
              })
            );
            const answersFileUrlsObj = Object.assign({}, ...answersFileUrls);

            return { ...data, helpFileUrls, answersFileUrls: answersFileUrlsObj };
          })
        );
        setHelpWithAnswersList(listWithFileUrls);
      }
    };

    fetchHelpData();
  }, [uid]);

  return (
    <div className='shadow-lg p-4'>
      <div className='flex justify-around items-center'>
        <button 
          className='relative flex items-center justify-center w-32 h-auto hover:scale-110 transition-all duration-300' 
          onClick={() => setOpenHelpForm(true)}
        >
          <img src='images/components/help.png' className='w-full h-auto' alt='Help Icon' />
          <Typography className='absolute font-bold'>
            HELP!
          </Typography>
        </button>

        <Button
          className='w-36 h-12'
          onClick={() => setShowHelpList(prev => !prev)}
        >
          {showHelpList ? <>HELPを隠す<ExpandLess /></> : <>HELPを見る<ExpandMore /></>}
        </Button>
      </div>

      {showHelpList && (
        <div className='max-h-96 overflow-auto mt-4'>
          {helpWithAnswersList.map((data, index) => (
            <HelpItem key={index} data={data} />
          ))}
        </div>
      )}

      <Popup open={openHelpForm} handleClose={() => setOpenHelpForm(false)}>
        <CreateHelpForm onSentHelp={() => setOpenHelpForm(false)} />
      </Popup>
    </div>
  );
};

interface HelpItemProps {
  data: HelpAndAnswersWithFileUrls;
}

const HelpItem: FC<HelpItemProps> = ({ data }) => {
  const [displayAnswers, setDisplayAnswers] = useState<HelpAnswerData[] | null>(null);

  return (
    <div className='relative mb-4 p-2 shadow-lg max-w-96 overflow-auto break-words'>
      <SubjectIcon subject={data.help.subject} />
      <Typography
        className={cn("text-center py-1 rounded w-20", data.help.solved ? "bg-green-200" : "bg-red-200")}
      >
        {data.help.solved ? "解決済み" : "未解決"}
      </Typography>

      <Typography noWrap={false}>
        {data.help.question}
      </Typography>
      <div className='flex justify-between items-end'>
        <FilePreview urls={data.helpFileUrls} />
        {data.answers.length > 0 && 
          <div
            onClick={() => setDisplayAnswers(data.answers)}
            className='bg-blue-300 text-center font-bold w-44 h-min p-1 rounded-md hover:cursor-pointer hover:scale-110 transition-transform duration-300'
          >
            {data.answers.length}件の回答があります！
          </div>
        }
      </div>

      <Popup open={!!displayAnswers} handleClose={() => setDisplayAnswers(null)}>
        <AnswersView answers={displayAnswers || []}/>
      </Popup>
    </div>
  )
};

export default Helps;
