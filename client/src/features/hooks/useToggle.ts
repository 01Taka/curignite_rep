import { useState, useCallback } from "react";

const useToggle = (initialState: boolean = false, onChange?: (open: boolean) => void) => {
  const [open, setOpen] = useState<boolean>(initialState);

  const toOpen = useCallback(() => {
    setOpen(true);
    if (onChange) onChange(true);
  }, [onChange]);

  const toClose = useCallback(() => {
    setOpen(false);
    if (onChange) onChange(false);
  }, [onChange]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const newValue = !prev;
      if (onChange) onChange(newValue);
      return newValue;
    });
  }, [onChange]);

  const setToggle = useCallback((value: boolean) => {
    setOpen(value);
    if (onChange) onChange(value);
  }, [onChange]);

  return { open, setOpen, setToggle, toOpen, toClose, toggle };
};

export default useToggle;
