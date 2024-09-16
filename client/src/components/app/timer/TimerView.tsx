// TimerView.tsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { HexColorCode } from '../../../types/util/utilTypes';

interface TimerViewProps {
  totalTime: number; // 総タイマー時間（ミリ秒）
  elapsedTime: number; // 経過時間（ミリ秒）
  isRunning?: boolean; // タイマーが動いているかどうか
  backgroundColor?: HexColorCode; // 背景色
  progressColor?: HexColorCode; // プログレスバーの色
  blinkRate?: number;
}

const TimerView: React.FC<TimerViewProps> = ({ totalTime, elapsedTime, isRunning = true, backgroundColor = '#999', progressColor = '#1976d2', blinkRate = 800 }) => {
  const [blink, setBlink] = useState(false);

  // 時間を分と秒に変換する関数
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // プログレスバーの値を計算する
  const progress = (elapsedTime / totalTime) * 100;

  // 停止中の点滅エフェクトのための useEffect
  useEffect(() => {
    let blinkInterval: NodeJS.Timeout | null = null;

    if (!isRunning) {
      blinkInterval = setInterval(() => {
        setBlink((prev) => !prev);
      }, blinkRate);
    } else {
      setBlink(false); // isRunning が true の場合は点滅を停止
    }

    return () => {
      if (blinkInterval) clearInterval(blinkInterval);
    };
  }, [isRunning]);

  return (
    <Box
      className="relative"
      sx={{
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginTop: '10px',
            opacity: !blink ? 1 : 0.2, // 点滅エフェクト
            transition: 'opacity 0.2s ease-in', // スムーズな点滅
          }}
        >
          {formatTime(elapsedTime)}
        </Typography>
        <Divider />
        <Typography variant="h6">{formatTime(totalTime)}</Typography>
      </Box>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={140} // Matches the container size
        thickness={3} // Adjusts the thickness of the progress circle
        sx={{
          color: progressColor, // プログレスバーの色
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </Box>
  );
};

export default TimerView;
