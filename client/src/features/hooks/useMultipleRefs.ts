import React, { useRef } from 'react';

function useMultipleRefs<T>(count: number): React.RefObject<T>[] {
  const refs = useRef<Array<React.RefObject<T>>>([]);

  // 初期化処理
  if (refs.current.length !== count) {
    refs.current = Array(count)
      .fill(null)
      .map(() => React.createRef<T>());
  }

  return refs.current;
}

export default useMultipleRefs;
