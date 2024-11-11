import { Box } from "@mui/material";

interface RangeNumbersDisplayProps {
  numbers: number[];
  cellSize?: number;
  spaceSize?: number;
  splitBorder?: number;
  handleSelectColor: (num: number) => string;
  onClickNumber: (num: number) => void;
}

const RangeNumbersDisplay: React.FC<RangeNumbersDisplayProps> = ({
  numbers,
  cellSize = 28,
  spaceSize = 0.4,
  splitBorder = 20,
  handleSelectColor,
  onClickNumber
}) => {
  // Split `problemNumbers` into two rows
  const [row1, row2] =  numbers.length < splitBorder ? [numbers, []] : 
  [numbers.filter((_, index) => index % 2 === 0), numbers.filter((_, index) => index % 2 !== 0)]

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

export default RangeNumbersDisplay