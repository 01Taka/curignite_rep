import { useEffect, useState } from 'react';

const useToggleList = (initialState: boolean, count: number) => {
  const [isOpenAll, setIsOpenAll] = useState(initialState);
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (initialState) {
      setOpenIndexes(new Set(Array.from(Array(count).keys())));
    } else {
      setOpenIndexes(new Set());
    }
  }, [initialState, count]);

  const handleToggleAll = () => {
    setIsOpenAll((prev) => !prev);
    setOpenIndexes((prev) => {
      return prev.size === count ? new Set() : new Set(Array.from(Array(count).keys()));
    });
  };

  const toggleOpenIndex = (index: number) => {
    setOpenIndexes((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  return { isOpenAll, openIndexes, handleToggleAll, toggleOpenIndex };
};

export default useToggleList;
