import { FC, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { IndexedLearningSessionService } from "../../../functions/browserStorage/indexedDB/services/indexedLearningSessionService";
import { CircularProgress } from "@mui/material";

interface StartLearningButtonProps {
  onClickAtLearning: () => void;
  onClickAtNotLearning: () => void;
}

const StartLearningButton: FC<StartLearningButtonProps> = ({ onClickAtLearning, onClickAtNotLearning }) => {
  const uid = useAppSelector((state) => state.userSlice.uid);
  const [isLearning, setIsLearning] = useState(false);
  const [buttonText, setButtonText] = useState("学習中");

  const updateIsLearning = useCallback(async () => {
    if (uid) {
      const currentSession = await IndexedLearningSessionService.getCurrentSession(uid);
      setIsLearning(!!currentSession);
    }
  }, [uid]);

  useEffect(() => {
    updateIsLearning();
  }, [updateIsLearning]);

  const handleMouseEnter = () => setButtonText("集中モード");
  const handleMouseLeave = () => setButtonText("学習中");

  const renderLearningButton = () => (
    <div
      className="relative w-36 h-36 bg-orange-400 rounded-full z-10 hover:scale-125 hover:cursor-pointer transition duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClickAtLearning}
    >
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
        {buttonText}
      </div>
      <CircularProgress
        disableShrink
        size="auto"
        style={{ animationDuration: "5s" }}
        className="absolute w-36 h-36 inset-0 flex items-center justify-center"
        color="error"
      />
    </div>
  );

  const renderStartButton = () => (
    <button
      className="w-36 h-36 bg-lime-400 hover:bg-lime-500 shadow-md rounded-full z-10 transition-all duration-300 hover:scale-110"
      onClick={onClickAtNotLearning}
    >
      <div className="text-2xl font-bold">学習を開始</div>
    </button>
  );

  return (
    <div className="fixed flex justify-center bottom-8 w-full">
      <div className="relative">
        <div className="absolute inset-0 flex justify-center items-center w-full h-full">
          {isLearning ? renderLearningButton() : renderStartButton()}
        </div>
        <img
          src="images/components/tower.png"
          alt="ダンジョン入口"
          className="w-auto h-80 rounded-3xl opacity-60 blur-sm"
        />
      </div>
    </div>
  );
};

export default StartLearningButton;
