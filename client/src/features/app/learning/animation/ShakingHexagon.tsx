import React from 'react';
import styled, { keyframes } from 'styled-components';

// 振動のアニメーションの設定
const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  80% { transform: translateX(0px); }
  85% { transform: translateX(-3px); }
  90% { transform: translateX(3px); }
  95% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
`;

// スタイル付きコンポーネント
const Hexagon = styled.div`
  pr: 5px;
  width: 100px;
  height: 86.6px; /* 100px * (√3 / 2) */
  background-color: #999; // 緑色
  clip-path: polygon(
    25% 0%,   /* 上の左 */
    75% 0%,   /* 上の右 */
    100% 50%, /* 右側 */
    75% 100%, /* 下の右 */
    25% 100%, /* 下の左 */
    0% 50%    /* 左側 */
  );
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${shakeAnimation} 3s ease-in-out infinite; // 1秒間隔で振動
`;

interface ShakingHexagonProps {
  size?: number;
}

const ShakingHexagon: React.FC<ShakingHexagonProps> = ({ size = 100 }) => {
  return (
    <Hexagon style={{
      width: size,
      height: size * 0.866
    }}/>
  );
};

export default ShakingHexagon;
