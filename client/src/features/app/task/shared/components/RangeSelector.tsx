import { Box, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import RangeNumbersDisplay from "./RangeNumbersDisplay";
import { isNumberInRange } from "../../../../../functions/utils/rangeUtils";
import useRangeSelection from "../../../../hooks/range/useRangeSelection";
import { ProblemContainerRef } from "../../step/problemSetStep/problemSetStepTypes";
import SnackbarForRangeSelection from "./SnackbarForRangeSelection";

interface ProblemContainerProps {
  id: string;
  name: string;
  numbers: number[];
  removeNumbers?: number[];
  onSelectProblemNumber: (num: number) => void;
  onSelectProblems: (name: string, numbers: number[]) => void;
}

const RangeSelector = forwardRef<ProblemContainerRef, ProblemContainerProps>(({
  id,
  name,
  numbers,
  removeNumbers = [],
  onSelectProblemNumber,
  onSelectProblems
}, ref) => {
  const {
    state,
    selectedRanges,
    getNumberColor,
    onSelectNumber,
    setRange,
    onCancelSelection,
    onDeleteOperatingRange,
    deleteAllSelection
  } = useRangeSelection();

  useImperativeHandle(ref, () => ({
    onCancelSelection() {
      onCancelSelection();
    },
    deleteAllSelection() {
      deleteAllSelection();
    }
  }));

  const validNumber = useMemo(() => {
    return numbers.filter(num => !removeNumbers.includes(num));
  }, [numbers, removeNumbers]);

  const selectedProblems = useMemo(() => {
    return validNumber.filter(num => isNumberInRange(selectedRanges, num));
  }, [validNumber, selectedRanges]);

  useEffect(() => {
    onSelectProblems(id, selectedProblems);
  }, [id, onSelectProblems, selectedProblems]);

  const handleSelectNumber = (num: number) => {
    onSelectNumber(num);
    onSelectProblemNumber(num);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography mr={1}>{name}</Typography>
      <RangeNumbersDisplay numbers={validNumber} onClickNumber={handleSelectNumber} handleSelectColor={getNumberColor} />
      <SnackbarForRangeSelection
        categoryName={name}
        state={state}
        onCancelSelection={onCancelSelection}
        onDeleteOperatingRange={onDeleteOperatingRange}
        onSelectAll={() => setRange(validNumber[0], validNumber[validNumber.length - 1])}
      />
    </Box>
  );
});




export default RangeSelector