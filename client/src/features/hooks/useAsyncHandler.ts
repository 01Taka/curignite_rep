import { useState } from "react";

const useAsyncHandler = <T = void>() => {
  const [asyncStatus, setAsyncStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const logError = (error: unknown, userMessage?: string) => {
    console.error(error);
    if (userMessage !== undefined) setErrorMessage(userMessage);
    if (error instanceof Error) {
      setError(error);
    }
    setAsyncStatus("error");
  };

  const setDataOnSuccess = (data: T) => {
    setAsyncStatus("success");
    setData(data);
  };

  const reset = () => {
    setAsyncStatus("idle");
    setData(null);
    setError(null);
    setErrorMessage("");
  };

  const startLoading = () => {
    setAsyncStatus("loading");
  };

  // 改善されたcallAsyncFunction
  const callAsyncFunction = async <A extends any[]>(
    args: A,
    func: (...args: A) => Promise<T>,
    onFailedMessage?: string
  ): Promise<boolean> => {
    startLoading();
    try {
      const result = await func(...args);
      setDataOnSuccess(result);
      return true;
    } catch (error) {
      logError(error, onFailedMessage);
      return false;
    }
  };

  return {
    asyncStatus,
    data,
    error,
    errorMessage,
    setErrorMessage,
    startLoading,
    setDataOnSuccess,
    logError,
    reset,
    callAsyncFunction,
  };
};

export default useAsyncHandler;
