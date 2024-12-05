import { useEffect, useState, useCallback } from "react";

type SaveDataOptions<T> = {
  key: string;
  saveFunction?: (key: string, data: T | null) => void;
};

const defaultSaveFunction = <T>(key: string, data: T | null) => {
  localStorage.setItem(key, JSON.stringify(data));
  console.log("Data saved:", { key, data });
};

const useSaveDataBeforeReload = <T>({ key, saveFunction = defaultSaveFunction }: SaveDataOptions<T>) => {
  const [saveData, setSaveData] = useState<T | null>(null);

  const handleSave = useCallback(() => {
    saveFunction(key, saveData);
  }, [key, saveFunction, saveData]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleSave();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleSave]);

  return { saveData, setSaveData, saveNow: handleSave };
};

export default useSaveDataBeforeReload;
