import { useState } from "react";
import { AsyncState, AsyncStatus } from "./AsyncHandlerTypes";

const useMultipleAsyncHandler = <StateTypes extends Record<string, any>>() => {
  const [asyncStates, setAsyncStates] = useState<{ [K in keyof StateTypes]?: AsyncState<StateTypes[K]> }>({});

  const initializeState = <K extends keyof StateTypes>() => ({
    status: "idle" as AsyncStatus,
    data: null as StateTypes[K] | null,
    error: null,
    errorMessage: "",
  });

  const logError = <K extends keyof StateTypes>(key: K, error: unknown, userMessage?: string) => {
    console.error(error);
    setAsyncStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: "error",
        error: error instanceof Error ? error : null,
        errorMessage: userMessage ?? "",
      } as AsyncState<StateTypes[K]>,
    }));
  };

  const setDataOnSuccess = <K extends keyof StateTypes>(key: K, data: StateTypes[K]) => {
    setAsyncStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: "success",
        data,
      } as AsyncState<StateTypes[K]>,
    }));
  };

  const reset = <K extends keyof StateTypes>(key: K) => {
    setAsyncStates((prev) => ({
      ...prev,
      [key]: initializeState(),
    }));
  };

  const startLoading = <K extends keyof StateTypes>(key: K) => {
    setAsyncStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: "loading",
      } as AsyncState<StateTypes[K]>,
    }));
  };

  const callAsyncFunction = async <K extends keyof StateTypes, A extends any[]>(
    key: K,
    args: A,
    func: (...args: A) => Promise<StateTypes[K]>,
    onFailedMessage?: string
  ): Promise<Awaited<StateTypes[K]> | null>=> {
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

  return {
    asyncStates,
    logError,
    reset,
    callAsyncFunction,
  };
};

export default useMultipleAsyncHandler;
