import { Box, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { isNumberInRange } from "../../../../../../functions/utils/rangeUtils";
import useRangeSelection from "../../../../../hooks/range/useRangeSelection";
import { ProblemGroup } from "../problemSetStepTypes";
import SnackbarForRangeSelection from "./SnackbarForRangeSelection";

interface ProblemContainerProps {
  problemGroup: ProblemGroup;
  removeNumbers?: number[];
  active: boolean;
  toActivate: () => void;
  onSelectProblems: (categoryName: string, numbers: number[]) => void;
}

const QuickPlanEntryContainer: React.FC<ProblemContainerProps> = ({ problemGroup, removeNumbers = [], active, toActivate, onSelectProblems }) => {
  const {
    state,
    selectedRanges,
    getNumberColor,
    onSelectNumber,
    setRange,
    onCancelSelection,
    onDeleteOperatingRange
  } = useRangeSelection();

  const validNumber = useMemo(() => {
    return problemGroup.problemNumbers.filter(num => !removeNumbers.includes(num));
  }, [problemGroup.problemNumbers, removeNumbers]);

  const selectedProblems = useMemo(() => {
    return validNumber.filter(num => isNumberInRange(selectedRanges, num));
  }, [validNumber, selectedRanges]);

  useEffect(() => {
    onSelectProblems(problemGroup.id, selectedProblems)
  }, [selectedRanges, problemGroup.id, onSelectProblems]);

  useEffect(() => {
    if (!active && state !== 'idle') {
      onCancelSelection();
    }
  }, [active]);

  const handleSelectNumber = (num: number) => {
    onSelectNumber(num);
    toActivate();
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography mr={1}>{problemGroup.categoryName}</Typography>
      <ProblemNumbers problemNumbers={validNumber} onClickNumber={handleSelectNumber} handleSelectColor={getNumberColor} />
      <SnackbarForRangeSelection
        categoryName={problemGroup.categoryName}
        state={state}
        onCancelSelection={onCancelSelection}
        onDeleteOperatingRange={onDeleteOperatingRange}
        onSelectAll={() => setRange(validNumber[0], validNumber[validNumber.length - 1])}
      />
    </Box>
  );
};

interface ProblemNumbersProps {
  problemNumbers: number[];
  cellSize?: number;
  spaceSize?: number;
  splitBorder?: number;
  handleSelectColor: (num: number) => string;
  onClickNumber: (num: number) => void;
}

const ProblemNumbers: React.FC<ProblemNumbersProps> = ({
  problemNumbers,
  cellSize = 28,
  spaceSize = 0.4,
  splitBorder = 20,
  handleSelectColor,
  onClickNumber
}) => {
  // Split `problemNumbers` into two rows
  const [row1, row2] =  problemNumbers.length < splitBorder ? [problemNumbers, []] : 
  [problemNumbers.filter((_, index) => index % 2 === 0), problemNumbers.filter((_, index) => index % 2 !== 0)]

  return (
    <Box sx={{ width: '100%', pb: 1, overflowX: 'auto' }}>
      {[row1, row2].map((row, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            gap: spaceSize,
            justifyContent: 'start', // centers items if container width exceeds content
            mb: rowIndex === 0 ? spaceSize : 0, // space between rows
            pl: rowIndex === 0 ? 0 : cellSize / 24,
          }}
        >
          {row.map((num, index) => (
            <button onClick={()=> onClickNumber(num)}>
              <Box
                key={`${rowIndex}-${index}`}
                sx={{
                  height: cellSize,
                  minWidth: cellSize,
                  maxWidth: cellSize,
                  textAlign: 'center',
                  border: 1,
                  borderColor: 'grey',
                  borderRadius: 1,
                  bgcolor: handleSelectColor(num)
                }}
              >
                {num}
              </Box>
            </button>
          ))}
        </Box>
      ))}
    </Box>
  );
};


export default QuickPlanEntryContainer