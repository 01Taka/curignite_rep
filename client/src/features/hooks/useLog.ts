import { useEffect } from "react";

type LogLevel = 'info' | 'warn' | 'error';

const useLog = <T>(trackingData: T, level: LogLevel = 'info') => {
  useEffect(() => {
    switch (level) {
      case 'warn':
        console.warn(trackingData);
        break;
      case 'error':
        console.error(trackingData);
        break;
      case 'info':
      default:
        console.log(trackingData);
    }
  }, [trackingData, level]);
};

export default useLog;