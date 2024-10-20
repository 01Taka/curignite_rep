import { useState, useEffect, useRef } from 'react';

const usePulseOnChange = (value: any, pulseDuration: number = 100) => {
  const [hasChanged, setHasChanged] = useState(false);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    // 初回レンダリング時は何もしない
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    setHasChanged(true);
    const timeout = setTimeout(() => {
      setHasChanged(false);
    }, pulseDuration);

    // クリーンアップ時に前のタイマーをクリア
    return () => clearTimeout(timeout);
  }, [value, pulseDuration]);

  return hasChanged;
}

export default usePulseOnChange;
