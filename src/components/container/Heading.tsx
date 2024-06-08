import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

interface HeadingProps {
  children: ReactNode;
  level: 0 | 1 | 2 | 3 | 4;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ children, level, className }) => {
  // レベルに応じたTailwind CSSのクラス名を定義
  const levelClasses = [
    'sm:text-6xl text-4xl font-extrabold',
    'sm:text-4xl text-3xl font-bold',
    'sm:text-2xl text-xl font-bold',
    'sm:text-xl text-lg font-bold',
    'sm:text-lg text-base font-bold'
  ];

  // クラス名を選択
  const levelClass = levelClasses[level];

  // コンポーネントのレンダリング
  const Tag = `h${level + 1}` as keyof JSX.IntrinsicElements;
  return (
    <Tag className={cx(levelClass, className)}>
      {children}
    </Tag>
  );
}

export default Heading;
