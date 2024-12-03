import { useCallback, useEffect, useMemo, useState } from "react";
import { AsyncState, AsyncStatus } from "./AsyncHandlerTypes";
import useJsonMemo from "../navigate/useJsonMemo";

const useMultipleAsyncHandler = <StateTypes extends Record<string, any>>(keys?: (keyof StateTypes)[]) => {
  const [asyncStates, setAsyncStates] = useState<{ [K in keyof StateTypes]?: AsyncState<StateTypes[K]> }>({});
  const [globalError, setGlobalError] = useState<{ error: unknown; message: string | null }>({ error: null, message: null });

  const initializeState = useCallback(<K extends keyof StateTypes>() => ({
    status: "idle" as AsyncStatus,
    data: null as StateTypes[K] | null,
    error: null,
    errorMessage: "",
  }), []);

  const keysJson = useJsonMemo(keys ?? []);

  useEffect(() => {
    if (keysJson) {
      const asyncStates = keysJson.reduce((acc, key) => {
        acc[key] = initializeState();
        return acc;
      }, {} as { [K in keyof StateTypes]?: AsyncState<StateTypes[K]> });
      setAsyncStates(asyncStates);
    }
  }, [keysJson, initializeState, setAsyncStates]);

  const allMatchStates: AsyncStatus | "noItems" | "noMatch" = useMemo(() => {
    const status = Object.values(asyncStates);
    
    if (status.length === 0) return 'noItems';
  
    const targetStatus = status[0].status as AsyncStatus; // 明示的に型を設定
    const isMatchAll = status.every(state => state.status === targetStatus);

    return isMatchAll ? targetStatus : 'noMatch';
  }, [asyncStates]);
  

  const logError = <K extends keyof StateTypes>(key: K, error: unknown, userMessage?: string) => {
    console.error(error);

    // 個別状態の更新
    setAsyncStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: "error",
        error: error instanceof Error ? error : null,
        errorMessage: userMessage ?? "",
      } as AsyncState<StateTypes[K]>,
    }));

    // 全体エラーの更新
    setGlobalError({
      error,
      message: userMessage ?? (error instanceof Error ? error.message : null),
    });
  };

  const setDataOnSuccess = <K extends keyof StateTypes>(key: K, data: StateTypes[K]) => {
    setAsyncStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: "success",
        data,
        error: null,
        errorMessage: "",
      } as AsyncState<StateTypes[K]>,
    }));

    // 成功時に全体エラーをリセット
    setGlobalError({ error: null, message: null });
  };

  const reset = <K extends keyof StateTypes>(key: K) => {
    setAsyncStates((prev) => ({
      ...prev,
      [key]: initializeState(),
    }));

    // リセット時に全体エラーもリセット
    setGlobalError({ error: null, message: null });
  };

  const startLoading = <K extends keyof StateTypes>(key: K) => {
    setAsyncStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: "loading",
        error: null,
        errorMessage: "",
      } as AsyncState<StateTypes[K]>,
    }));
  };

  const callAsyncFunction = async <K extends keyof StateTypes, A extends any[]>(
    key: K,
    args: A,
    func: (...args: A) => Promise<StateTypes[K]>,
    onFailedMessage?: string
  ): Promise<Awaited<StateTypes[K]> | null> => {
    if (!asyncStates[key]) {
      setAsyncStates((prev) => ({ ...prev, [key]: initializeState() }));
    }
    startLoading(key);
    try {
      const result = await func(...args);
      setDataOnSuccess(key, result);
      return result;
    } catch (error) {
      logError(key, error, onFailedMessage);
      return null;
    }
  };

  const resetGlobalError = () => {
    setGlobalError({ error: null, message: null });
  };

  return {
    asyncStates,
    allMatchStates,
    globalError,
    logError,
    reset,
    setGlobalError,
    resetGlobalError,
    callAsyncFunction,
  };
};

export default useMultipleAsyncHandler;
