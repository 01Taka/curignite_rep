import { Box, Button } from "@mui/material";
import { FC } from "react";
import { FormStateChangeFunc } from "../../../types/util/componentsTypes";

interface FileSelectorProps {
  onFileChange: FormStateChangeFunc;
  handleClose: () => void;
}

const FileSelector: FC<FileSelectorProps> = ({ onFileChange, handleClose }) => {
  return (
    <Box p={2}>
    <div>
      <input
        type="file"
        id="file-upload"
        onChange={onFileChange}
        multiple
        style={{ display: "none" }}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span">
          アップロードするファイルを選択
        </Button>
      </label>
    </div>
      <Box mt={1}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </Box>
    </Box>
  )
}

export default FileSelector;
