import React, { FC } from 'react';
import CollectionContainer from './CollectionContainer';
import { CollectionWithTasksData, TaskCollectionData } from '../../../../types/firebase/db/common/task/taskStructure';
import { Typography } from '@mui/material';

interface TaskCollectionsViewProps {
  collectionWithTasks: CollectionWithTasksData[];
  onClickCollection?: (taskCollection: TaskCollectionData) => void;
}

const TaskCollectionsView: FC<TaskCollectionsViewProps> = ({ collectionWithTasks, onClickCollection = () => {} }) => {
  return (
    <>
    {collectionWithTasks.length > 0 ? (
      <div className="flex flex-wrap justify-center gap-4">
        {collectionWithTasks.map(({ collectionData, tasksData }) => (
          <div key={collectionData.docId} className="w-44 h-64">
            <CollectionContainer
              taskCollection={collectionData}
              collectionTasks={tasksData}
              onClickCollection={onClickCollection}
            />
          </div>
        ))}
      </div>
    ) : (
      <div>
        <Typography variant='h5'>「問題集を作成」から問題集を作成してみましょう。</Typography>
        <Typography variant='h6'>
          <ul>
            <li>・ページ機能 - ページと期限を指定するだけで簡単にタスクを作成できます。</li>
            <li>・完了ページ自動管理 - 過去に完了したページを保存しておくことができます。</li>
          </ul>
          <p>これらの機能を利用してみましょう!</p>
        </Typography>
      </div>
    )}
    </>
  );
};

export default TaskCollectionsView;
