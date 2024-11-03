import React from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

// ランダムに歪むアニメーションを定義
const randomDistort = keyframes`
  0% { clip-path: ellipse(50% 50% at 50% 50%); }
  10% { clip-path: ellipse(50% 50% at 50% 50%); }
  20% { clip-path: ellipse(52% 48% at 50% 52%); }
  30% { clip-path: ellipse(50% 50% at 50% 50%); }
  40% { clip-path: ellipse(48% 50% at 50% 48%); }
  50% { clip-path: ellipse(48% 48% at 50% 50%); }
  60% { clip-path: ellipse(50% 50% at 50% 52%); }
  70% { clip-path: ellipse(52% 50% at 48% 50%); }
  80% { clip-path: ellipse(50% 50% at 50% 50%); }
  90% { clip-path: ellipse(52% 48% at 50% 52%); }
  100% { clip-path: ellipse(50% 50% at 50% 50%); }
`;


// 水の輪のコンテナ
const WaterRingContainer = styled(motion.div)`
  width: 100px;
  height: 100px;
  background-color: #00aaff;
  border-radius: 50%;
  animation: ${randomDistort} 3s ease-in-out infinite;
  filter: blur(2px);
`;

// コンポーネント
interface WaterRingAnimationProps {
  size?: number
}
const WaterRingAnimation: React.FC<WaterRingAnimationProps> = ({ size = 100 }) => {
  return (
    <WaterRingContainer
      style={{
        width: size,
        height: size
      }}
      initial={{ scale: 1 }}
      animate={{ scale: 1.05 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
};

export default WaterRingAnimation;
