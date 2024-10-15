import { Avatar, Box, Button, Typography } from '@mui/material';
import React from 'react';
import { HexColorCode } from '../../../types/util/utilTypes';
import HideEmpty from '../wrap/HideEmpty';
import { ChoicesItem } from './choicesSelectorTypes';
import MultiLineText from '../text/MultiLineText';
import { AvatarVariant } from '../../../types/module/mui/muiTypes';


interface ChoicesSelectorContainerProps {
  item: ChoicesItem;
  bgcolor: HexColorCode;
  imageShape: AvatarVariant;
  imageMaxWidth: number | string;
  containerHeight?: number;
  onClick: () => void;
}

const ChoicesSelectorContainer: React.FC<ChoicesSelectorContainerProps> = ({ item, imageShape, bgcolor, imageMaxWidth, containerHeight, onClick }) => {

  return (
    <Button
      onClick={onClick}
      sx={{
        color: 'black',
        padding: 0,
        margin: 0,
        marginY: 0.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '95%',
          height: containerHeight,
          maxHeight: 150,
          borderRadius: 2,
          bgcolor,
          alignItems: 'center',
          padding: 1,
          transition: 'transform 0.2s ease', // アニメーション効果
          '&:hover': {
            transform: 'scale(1.05)', // ホバー時にサイズを110%にする
            boxShadow: 3,
          },
        }}
      >
      <HideEmpty requiredContent={[item.imageSetting, item.imageSetting?.src]}>
        <Avatar
            variant={imageShape}
            src={item.imageSetting?.src}
            alt={item.imageSetting?.alt}
            sx={{
              width: 'auto', // 自動的に幅を調整
              height: '95%', // コンテナの高さに合わせる
              maxHeight: 135,
              maxWidth: imageMaxWidth
            }}
          />
      </HideEmpty>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 0.5,
        }}
      >
        <Typography variant='subtitle1'>
          {item.title}
        </Typography>
        <HideEmpty requiredContent={item.contents}>
          <MultiLineText variant='body2' sx={{width: '100%'}}>
            {item.contents}
          </MultiLineText>
        </HideEmpty>
      </Box>
      </Box>
    </Button>
  );
};

export default ChoicesSelectorContainer;