import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// アニメーションの設定
const rotateAnimation = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-5deg) scale(1.05); }
  75% { transform: rotate(5deg) scale(0.95); }
  100% { transform: rotate(0deg) scale(1); }
`;

// スタイル付きコンポーネント
const Square = styled(motion.div)`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background-color: #61c965; // 緑色
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${rotateAnimation} 5s linear infinite;
`;

interface RotatingSquareProps {
  size?: number;
}

const RotatingSquare: React.FC<RotatingSquareProps> = ({ size = 100 }) => {
  return (
    <Square
      style={{
        width: size,
        height: size
      }}
    />
  );
};

export default RotatingSquare;
