import { Box, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { format } from 'date-fns';

interface QuestionContainerProps {
    title: string;
    content?: string; // contentがオプショナルであることを示す
    postDate: Timestamp;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({
    title,
    content = '', // デフォルト値を空文字列に設定
    postDate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const maxChars = 250; // 表示する最大文字数
  const date = postDate.toDate();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const truncatedContent = content.length > maxChars && !expanded 
    ? `${content.substring(0, maxChars)}...` 
    : content;

  const post = (
    <React.Fragment>
        <CardContent>
            <Typography variant="h5" component="div">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {format(date, 'yyyy-MM-dd HH:mm')}
            </Typography>
            <Typography variant="body1" component="p">
                {truncatedContent}
            </Typography>
            {content.length > maxChars && (
                <CardActions>
                    <Button size="small" onClick={handleExpandClick}>
                        {expanded ? '閉じる' : 'もっと見る'}
                    </Button>
                </CardActions>
            )}
        </CardContent>
    </React.Fragment>
  );

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined" className='my-4'>{post}</Card>
    </Box>
  );
}

export default QuestionContainer;
