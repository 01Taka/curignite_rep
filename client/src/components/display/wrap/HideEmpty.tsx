import React, { ReactNode } from 'react';

interface HideEmptyProps {
  children: ReactNode;
  requiredContent?: any;
  state?: 'hide' | 'display' | 'auto';
}

const HideEmpty: React.FC<HideEmptyProps> = ({ children, requiredContent = children, state = 'auto' }) => {
  // requiredContent が配列の場合と単一の値の場合に応じてチェック
  const hasContent = Array.isArray(requiredContent)
    ? requiredContent.every(item => Boolean(item))
    : Boolean(requiredContent);

  const shouldDisplay = (state === 'auto' && hasContent) || state === 'display';

  return shouldDisplay ? <>{children}</> : null;
};

export default HideEmpty;
