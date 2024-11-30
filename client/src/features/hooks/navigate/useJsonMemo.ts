import { useEffect, useState, useMemo } from "react";

const useJsonMemo = <T extends object>(value: T): T => {
  const stringifiedValue = useMemo(() => JSON.stringify(value), [value]);
  const [memoValue, setMemoValue] = useState<T>(value);

  useEffect(() => {
    setMemoValue((prev) => (stringifiedValue !== JSON.stringify(prev) ? value : prev));
  }, [stringifiedValue, value]);

  return memoValue;
};

export default useJsonMemo;
