import React, { FC } from 'react';
import { HelpAnswerData } from '../../../types/firebase/db/user/userStructure';
import { Avatar, Typography } from '@mui/material';
import FilePreview from '../../../components/util/FilePreview';
import { useUserMap } from '../../hooks/useUserMap';

interface AnswersViewProps {
  answers: HelpAnswerData[];
}

const AnswersView: FC<AnswersViewProps> = ({ answers }) => {
  const { userMap, loading, error } = useUserMap(answers.map(answer => answer.answeredBy));

  if (loading) return <Typography>ロード中...</Typography>;
  if (error) return <Typography>エラーが発生しました: {error}</Typography>;

  return (
    <div className="space-y-4">
      {answers.map((answer, index) => {
        const user = userMap[answer.answeredBy]; // answeredByのUIDからユーザーデータを取得

        return (
          <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <Typography variant="subtitle1" className="font-bold">
              回答 {index + 1}
            </Typography>
            <Typography variant="body1" className="mt-2">
              {answer.answer}
            </Typography>

            {user && (
              <Typography variant="body2" className="text-gray-500 mt-2">
                答えた人: 
                <Avatar src={user.avatarIconUrl || undefined}>
                  {!user.avatarIconUrl && user.username[0]}
                </Avatar>
                <Typography>
                  {user.username}
                </Typography>
              </Typography>
            )}

            {answer.fileIds.length > 0 && (
              <div className="mt-4">
                <Typography variant="subtitle2" className="mb-2">
                  添付ファイル:
                </Typography>
                <FilePreview urls={answer.fileIds} /> {/* TODO ファイルクリックで表示できるようにする */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AnswersView;
