import React from 'react';

interface TaskPreviewProps { }

interface TaskDataPreview {
  taskId: string;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({}) => {
  return (
    <div>
      TaskPreviewContent
    </div>
  );
};

export default TaskPreview;