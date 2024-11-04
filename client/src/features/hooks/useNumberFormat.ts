import { useState, useCallback } from "react";
import { clamp } from "../../functions/utils/numberUtils";

interface UseNumberFormatOptions<T extends "" | number> {
  initialValue?: T | number;
  min?: number;
  max?: number;
  emptyValue?: T | number;
}

const useNumberFormat = <T extends "" | number>({
  initialValue,
  min = -Infinity,
  max = Infinity,
  emptyValue = NaN,
}: UseNumberFormatOptions<T>) => {
  const [value, setValue] = useState<T | number>(initialValue ?? emptyValue);

  const onChangeValue = useCallback(
    (input: string | number) => {
      if (typeof input === 'number') {
        setValue(clamp(input, min, max));
        return;
      }
      const digits = input.replace(/[^0-9]/g, '');
      setValue(digits.length === 0 ? emptyValue : clamp(Number(digits), min, max));
    },
    [min, max, emptyValue]
  );

  return { value, onChangeValue };
};

export default useNumberFormat;
