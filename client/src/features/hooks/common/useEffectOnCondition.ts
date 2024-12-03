import { useEffect } from "react";

type Callback = () => void | Promise<void>;

interface UseEffectOnConditionOptions {
  onSuccess?: Callback | Callback[];
  onFailure?: Callback | Callback[];
  always?: Callback | Callback[];
}

const useEffectOnCondition = (
  condition: boolean,
  options: UseEffectOnConditionOptions
): void => {
  const { onSuccess, onFailure, always } = options;

  const runCallbacks = async (callbacks?: Callback | Callback[]) => {
    if (!callbacks) return;
    const callbacksArray = Array.isArray(callbacks) ? callbacks : [callbacks];
    for (const callback of callbacksArray) {
      await callback();
    }
  };

  useEffect(() => {
    const handleCondition = async () => {
      try {
        if (condition) {
          await runCallbacks(onSuccess);
        } else {
          await runCallbacks(onFailure);
        }
      } finally {
        await runCallbacks(always);
      }
    };
    handleCondition();
  }, [condition, onSuccess, onFailure, always]);
};

export default useEffectOnCondition;
