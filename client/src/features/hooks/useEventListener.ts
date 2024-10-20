import { useEffect, RefObject } from 'react';

const useEventListener = <T extends Event>(
  ref: RefObject<HTMLElement | null>,
  eventType: keyof HTMLElementEventMap,
  callback: (event: T) => void,
  options?: AddEventListenerOptions
) => {
  useEffect(() => {
    const element = ref.current;

    // イベントリスナーを設定
    const eventListener = (event: T) => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in event listener: ${error}`);
      }
    };

    if (element) {
      element.addEventListener(eventType, eventListener as EventListener, options);
    }

    // クリーンアップ
    return () => {
      if (element) {
        element.removeEventListener(eventType, eventListener as EventListener);
      }
    };
  }, [ref, eventType, callback, options]);
};

export default useEventListener;
