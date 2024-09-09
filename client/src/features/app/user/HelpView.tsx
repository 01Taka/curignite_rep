import { FC, useState } from "react";
import { HelpAndAnswersWithFileUrls, UserHelpData } from "../../../types/firebase/db/user/userStructure";
import useAnswerDisplayPopup from "../help/hooks/useAnswerDisplayPopup";
import HelpCard from "../help/HelpCard";
import { Button, Divider, Typography } from "@mui/material";
import Popup from "../../../components/util/Popup";
import CreateAnswerForm from "../help/CreateAnswerForm";

interface HelpViewProps {
  helpAndAnswerInfo: HelpAndAnswersWithFileUrls[] | null;
  loading: boolean;
}

const HelpView: FC<HelpViewProps> = ({ helpAndAnswerInfo, loading }) => {
  const [showFull, setShowFull] = useState(false);
  const [answeringTarget, setAnsweringTarget] = useState<HelpAndAnswersWithFileUrls | null>(null);
  const { handleSelectAnswers, AnswerPopup } = useAnswerDisplayPopup();

  const handleToggleShowFull = () => {
    setShowFull(prev => !prev);
  };

  if (loading) return <p>Loading Help...</p>;
  if (!helpAndAnswerInfo || helpAndAnswerInfo.length === 0) return null;

  const isMultipleQuestions = helpAndAnswerInfo.length > 1;
  const displayedInfo = showFull ? helpAndAnswerInfo : [helpAndAnswerInfo[0]];

  return (
    <>
      <div className='flex flex-col space-y-4 max-h-96 overflow-y-auto pt-2 w-full'>
        {showFull && isMultipleQuestions && (
          <ToggleShowButton 
            showFull={showFull} 
            handleToggleShowFull={handleToggleShowFull} 
          />
        )}
        {displayedInfo.map((value, index) => (
          <div key={index} className='flex flex-col'>
            <HelpItem 
              value={value} 
              onSelectAnswers={handleSelectAnswers} 
              onHelp={setAnsweringTarget}
            />
            {index === displayedInfo.length - 1 && isMultipleQuestions && (
              <ToggleShowButton 
                showFull={showFull} 
                handleToggleShowFull={handleToggleShowFull} 
              />
            )}
          </div>
        ))}
      </div>
      {AnswerPopup}
      <Popup open={!!answeringTarget} handleClose={() => setAnsweringTarget(null)}>
        {answeringTarget && <CreateAnswerForm targetHelpAndAnswersInfo={answeringTarget} onCreated={() => setAnsweringTarget(null)}/>}
      </Popup>
    </>
  );
};


interface HelpItemProps {
  value: HelpAndAnswersWithFileUrls;
  onSelectAnswers: (answers: HelpAndAnswersWithFileUrls) => void;
  onHelp: (targetHelp: HelpAndAnswersWithFileUrls) => void;
}

// ヘルプアイテムを独立したコンポーネントに分割
const HelpItem: FC<HelpItemProps> = ({ value, onSelectAnswers, onHelp }) => (
  <div className='flex justify-around items-center w-full'>
    <div className='min-w-96 max-w-96 px-4 py-2 bg-gray-200 rounded-lg'>
      <HelpCard helpAndAnswersInfo={value} onSelectAnswers={onSelectAnswers} />
    </div>
    <button
      className='w-16 h-24 border-4 border-blue-300 bg-blue-300 bg-opacity-0 rounded-lg transition duration-300 hover:scale-110 hover:bg-opacity-100'
      onClick={() => onHelp(value)}
      >
      助ける
    </button>
  </div>
);

// 表示切り替えボタンを独立したコンポーネントに分割
const ToggleShowButton: FC<{ showFull: boolean, handleToggleShowFull: () => void }> = ({ showFull, handleToggleShowFull }) => (
  <div className='ml-auto'>
    <Button size='small' onClick={handleToggleShowFull}>
      <Typography variant={`${showFull ? "body1" : "caption"}`}>
        {showFull ? '一部を表示' : 'すべて表示'}
      </Typography>
    </Button>
    {showFull && <Divider className='pt-2' />}
  </div>
);

export default HelpView;