import { useState, useRef, useCallback } from "react";

type UseLongPressOptions = {
  onShortPress?: () => void; // 短押し時の処理
  onLongPress?: () => void;  // 長押し時の処理
  threshold?: number;        // 長押しと判定する時間（ミリ秒）
};

export const useLongPress = ({
  onShortPress,
  onLongPress,
  threshold = 500, // デフォルトは 500ms
}: UseLongPressOptions) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsLongPress(false);

    // 長押しを判定するタイマーをセット
    timeoutRef.current = setTimeout(() => {
      setIsLongPress(true);
      if (onLongPress) onLongPress();
    }, threshold);
  }, [onLongPress, threshold]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 短押しと長押しを判定
    if (!isLongPress && onShortPress) {
      onShortPress();
    }
  }, [isLongPress, onShortPress]);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
};
