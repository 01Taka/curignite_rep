import { useEffect } from "react";

const useLog = (...trackingData: any[]) => {
  useEffect(() => {
    console.log(...trackingData);
  }, [trackingData]);
};

export default useLog;