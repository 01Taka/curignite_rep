import React, { FC } from 'react';
import { HelpAndAnswersWithFileUrls } from '../../../types/firebase/db/user/userStructure';
import SubjectIcon from '../../../components/util/SubjectIcon';
import FilePreview from '../../../components/util/FilePreview';
import { Typography } from '@mui/material';
import { cn } from '../../../functions/utils';

interface HelpCardProps {
  helpAndAnswersInfo: HelpAndAnswersWithFileUrls;
  shadow?: boolean;
  onSelectAnswers: (helpAndAnswersInfo: HelpAndAnswersWithFileUrls) => void;
}

const HelpCard: FC<HelpCardProps> = ({ helpAndAnswersInfo, shadow, onSelectAnswers }) => {
  return (
    <>
    <div className={cn("relative break-words", shadow && "bg-white p-4 shadow-lg rounded-md")}>
      <SubjectIcon subject={helpAndAnswersInfo.help.subject} />
      <Typography
        className={cn("text-center py-1 rounded w-20", helpAndAnswersInfo.help.solved ? "bg-green-200" : "bg-red-200")}
      >
        {helpAndAnswersInfo.help.solved ? "解決済み" : "未解決"}
      </Typography>

      <Typography noWrap={false}>
        {helpAndAnswersInfo.help.question}
      </Typography>
      <div className='flex justify-between items-end'>
        <FilePreview urls={helpAndAnswersInfo.helpFileUrls} />
        {helpAndAnswersInfo.answers.length > 0 && 
          <div
            onClick={() => onSelectAnswers(helpAndAnswersInfo)}
            className='bg-blue-300 text-center font-bold w-44 h-min p-1 rounded-md hover:cursor-pointer hover:scale-110 transition-transform duration-300'
          >
            {helpAndAnswersInfo.answers.length}件の回答があります！
          </div>
        }
      </div>
    </div>
    </>
  );
};

export default HelpCard;
