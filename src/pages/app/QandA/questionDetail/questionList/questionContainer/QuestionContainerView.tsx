import { Box, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import React from 'react';

interface QuestionContainerViewProps {
    title: string;
    content: string;
    overflow: boolean;
    postDateStr: string;
    expanded: boolean;
    handleExpandClick: () => void;
    onQuestionClick: () => void;
}

const QuestionContainerView: React.FC<QuestionContainerViewProps> = ({
    title,
    content = '',
    overflow,
    postDateStr,
    expanded,
    handleExpandClick,
    onQuestionClick,
}) => {
  const post = (
        <CardContent>
            <Typography variant="h5" component="div">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {postDateStr}
            </Typography>
            <Typography variant="body1" component="p">
                {content}
            </Typography>
            {overflow && (
                <CardActions>
                    <Button size="small" onClick={handleExpandClick}>
                        {expanded ? '閉じる' : 'もっと見る'}
                    </Button>
                </CardActions>
            )}
        </CardContent>
    );

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined" className='my-4'>
        <div onClick={onQuestionClick}>
            {post}
        </div>
    </Card>
    </Box>
  );
}

export default QuestionContainerView;
