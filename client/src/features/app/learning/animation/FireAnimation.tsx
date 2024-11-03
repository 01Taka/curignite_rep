// FireAnimation.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// アニメーション定義
const scaleUpDown = keyframes`
  0%, 100% { transform: scaleY(1) scaleX(1) rotate(45deg); }
  50%, 90% { transform: scaleY(1.1) rotate(45deg); }
  75% { transform: scaleY(0.95) rotate(45deg); }
  80% { transform: scaleX(0.95) rotate(45deg); }
`;

const particleUp = keyframes`
  0% { opacity: 0; }
  20%, 80% { opacity: 1; }
  100% { opacity: 0; top: -100%; transform: scale(0.5); }
`;

// スタイル設定
const FireContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const MainFire = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(farthest-corner at 10px 0, #d43300 0%, #ef5a00 95%);
  transform: scaleX(0.8) rotate(45deg);
  border-radius: 0 40% 60% 40%;
  filter: drop-shadow(0 0 10px #d43322);
  animation: ${scaleUpDown} 3s ease-out infinite;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ef5a00;
  border-radius: 50%;
  filter: drop-shadow(0 0 10px #d43322);
  top: 60%;
  left: 45%;
  animation: ${particleUp} 2s ease-out infinite;
`;

// FireAnimationコンポーネント
type FireAnimationProps = {
  size?: number;
};

const FireAnimation: React.FC<FireAnimationProps> = ({ size = 100 }) => (
  <FireContainer style={{ width: size, height: size }}>
    <MainFire />
    <Particle />
  </FireContainer>
);

export default FireAnimation;
