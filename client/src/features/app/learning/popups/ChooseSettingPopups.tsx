import React, { useState } from 'react';
import ChoicesSelectorPopup from '../../../../components/display/choicesSelector/ChoicesSelectorPopup';
import { ChoicesItem } from '../../../../components/display/choicesSelector/choicesSelectorTypes';

interface ChooseSettingPopupsProps { }

type SettingType = 'mission' | 'time' | 'member';

interface SettingChoices {
  choices: ChoicesItem<number>[];
  onClickChoices: (id: number) => void;
}

const ChooseSettingPopups: React.FC<ChooseSettingPopupsProps> = () => {
  const [currentSettingPopup, setCurrentSettingPopup] = useState<SettingType | null>('mission');

  const handleOnClickClose = () => {
    if (currentSettingPopup === "mission" || currentSettingPopup === "time") {
      setCurrentSettingPopup('member');
    } else {
      setCurrentSettingPopup(null);
    }
  }

  const settingChoices: Record<SettingType, SettingChoices> = {
    'mission': {
      choices: [
        { id: 0, title: '既存ミッションから選ぶ', imageSetting: { src: 'https://cdn-icons-png.flaticon.com/512/654/654116.png' }},
        { id: 1, title: '新しいミッションに挑戦', imageSetting: { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7CqtNLAt00tg9UPApKXijlTLUktjzdvuwfQ&s' } },
        { id: 2, title: '目標なしで始める' }
      ],
      onClickChoices(id) {
        switch (id) {
          case 0:
            /*
              既存のミッションのリストのポップアップを表示
              選択されたらそれを現在挑戦中のミッションに設定
              時間の設定に移動
            */
            break;
          case 1:
            /*
              ミッション作成フォームに移動
              作成されたミッションを現在挑戦中のミッションに設定
              時間の設定に移動
            */
            break;
          case 2:
            setCurrentSettingPopup('member');
            break;
        }
      },
    },
    'time': {
      choices: [
        { id: 0, title: `${0}分以内で挑戦`},
        { id: 1, title: 'カスタムタイムで挑戦' },
        { id: 2, title: '目標時間なしで始める'}
      ],
      onClickChoices(id) {
        switch (id) {
          case 0:
            /*
              現在のミッションの推定完了時間を取得
              それを目標の完了時間に指定
            */
            break;
          case 1:
            break;
            /*
              時間選択フォームを開く
              選択された時間を目標完了時間に設定
            */
          case 2:
            setCurrentSettingPopup('member');
            break;
        }
      },
    },
    'member': {
      choices: [
        { id: 0, title: '一緒に挑戦するメンバーを探す' },
        { id: 1, title: 'スキップ'}
      ],
      onClickChoices(id) {
        switch (id) {
          case 0:
            /*
              現在学習中のメンバー一覧を表示するポップアップを表示
              選択されたユーザーのスペースに参加する
              またはユーザーを招待する
            */
            break;
          case 1:
            setCurrentSettingPopup(null);
            break;
        }
      },
    }
  }

  if (!currentSettingPopup) {
    return null;
  }

  return (
    <div>
      <ChoicesSelectorPopup
        open
        handleClose={handleOnClickClose}
        choicesItems={settingChoices[currentSettingPopup].choices}
        onClickChoices={settingChoices[currentSettingPopup].onClickChoices}
      />
    </div>
  );
};

export default ChooseSettingPopups;