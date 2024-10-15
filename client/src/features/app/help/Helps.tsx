import React, { FC, useEffect, useState } from 'react';
import serviceFactory from '../../../firebase/db/factory';
import { useAppSelector } from '../../../redux/hooks';
import Popup from '../../../components/display/popup/Popup';
import CreateHelpForm from './CreateHelpForm';
import { HelpAndAnswersWithFileUrls } from '../../../types/firebase/db/user/userStructure';
import HelpsView from './HelpsView';
import { Button } from '@mui/material';

interface HelpsProps { }

const Helps: FC<HelpsProps> = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [helpWithAnswersList, setHelpWithAnswersList] = useState<HelpAndAnswersWithFileUrls[]>([]);
  const [openHelpForm, setOpenHelpForm] = useState(false);
  const [showHelpList, setShowHelpList] = useState(false); // HELP 一覧の表示トグル用

  useEffect(() => {
    const fetchHelpData = async () => {
      if (uid) {
        const helpService = serviceFactory.createUserHelpService();
        const list = await helpService.getAllHelpAndAnswersWithFileUrls(uid);
        setHelpWithAnswersList(list);
      }
    };

    fetchHelpData();
  }, [uid]);

  return (
    <>
    <div className='shadow-lg p-4 max-h-80 overflow-y-auto'>
      <div className='flex justify-around items-center'>
        <button 
          className='relative flex items-center justify-center w-32 h-auto hover:scale-110 transition-all duration-300' 
          onClick={() => setOpenHelpForm(true)}
        >
          <img src='images/components/help.png' className='w-full h-auto' alt='Help Icon' />
          <p className='absolute font-bold'>HELP!</p>
        </button>

        <Button className='w-36 h-12 rounded-lg' onClick={() => setShowHelpList(prev => !prev)}>
          {showHelpList ? 'HELPを隠す' : 'HELPを見る'}
        </Button>
      </div>

      {showHelpList && (
        <HelpsView helpWithAnswersList={helpWithAnswersList} shadow />
      )}
    </div>
    <Popup open={openHelpForm} handleClose={() => setOpenHelpForm(false)}>
        <CreateHelpForm onSentHelp={() => setOpenHelpForm(false)} />
    </Popup>
    </>
  );
};

export default Helps;
