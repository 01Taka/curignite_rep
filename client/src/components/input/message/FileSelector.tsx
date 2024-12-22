import { Box, Button } from "@mui/material";
import { FC } from "react";
import { FormStateChangeAction } from "../../../types/app/formStateTypes";

interface FileSelectorProps {
  onChangeFormState: (action: FormStateChangeAction) => void;
  handleClose: () => void;
}

const FileSelector: FC<FileSelectorProps> = ({ onChangeFormState, handleClose }) => {
  return (
    <Box p={2}>
    <div>
      <input
        type="file"
        id="file-upload"
        onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })}
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
