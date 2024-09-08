import React, { FC, useEffect, useState } from 'react';
import serviceFactory from '../../../firebase/db/factory';
import { useAppSelector } from '../../../redux/hooks';
import SubjectIcon from '../../../components/util/SubjectIcon';
import { Typography } from '@mui/material';
import Popup from '../../../components/util/Popup';
import CreateHelpForm from './CreateHelpForm';
import FilePreview from '../../../components/util/FilePreview';
import { storageManager } from '../../../firebase/storage/storageManager';
import { HelpAndAnswersWithFileUrls } from '../../../types/firebase/db/user/userStructure';

const Helps: FC = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [helpWithAnswersList, setHelpWithAnswersList] = useState<HelpAndAnswersWithFileUrls[]>([]);
  const [openHelpForm, setOpenHelpForm] = useState(false);

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
    <div>
      <button 
        className='relative flex items-center justify-center w-32 h-auto hover:scale-110 transition-all duration-300' 
        onClick={() => setOpenHelpForm(true)}
      >
        <img src='images/components/help.png' className='w-full h-auto' alt='Help Icon' />
        <Typography className='absolute font-bold'>
          HELP!
        </Typography>
      </button>

      {helpWithAnswersList.map((data, index) => (
        <HelpItem key={index} data={data} />
      ))}

      <Popup open={openHelpForm} handleClose={() => setOpenHelpForm(false)}>
        <CreateHelpForm onSentHelp={() => setOpenHelpForm(true)} />
      </Popup>
    </div>
  );
};

const HelpItem = ({ data }: { data: HelpAndAnswersWithFileUrls }) => (
  <div className='relative mb-4'>
    <SubjectIcon subject={data.help.subject} />
    <FilePreview urls={data.helpFileUrls} />
    <Typography>
      {data.help.question}
    </Typography>
    {data.answers.map((answer, index) => (
      <div key={index} className='mt-2'>
        <Typography variant='subtitle1'>
          Answer {index + 1}:
        </Typography>
        <Typography>
          {answer.text}
        </Typography>
        <FilePreview urls={data.answersFileUrls[answer.id] || []} />
      </div>
    ))}
  </div>
);

export default Helps;
