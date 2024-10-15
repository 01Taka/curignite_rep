import React from 'react';
import { ChoicesSelectorProps } from './choicesSelectorTypes';
import ChoicesSelectorContainer from './ChoicesSelectorContainer';
import { Box } from '@mui/material';

const ChoicesSelector: React.FC<ChoicesSelectorProps> = ({
  choicesItems,
  bgcolor = '#bbb',
  imageShape = 'rounded',
  imageMaxWidth = '30%',
  containerHeight,
  onClickChoices
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {choicesItems && choicesItems.map((item, index) => (
        <ChoicesSelectorContainer
          key={index}
          onClick={() => onClickChoices(item.id)}
          item={item}
          imageShape={imageShape}
          bgcolor={bgcolor}
          imageMaxWidth={imageMaxWidth}
          containerHeight={containerHeight}
        />
      ))}
    </Box>
  );
};

export default ChoicesSelector;