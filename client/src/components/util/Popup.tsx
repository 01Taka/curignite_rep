import { Box, Modal } from "@mui/material";
import { FC, ReactNode } from "react";
import CircularButton from "../input/button/CircularButton";
import { cn } from "../../functions/utils";

interface PopupProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  handleClose: () => void;
}


const Popup: FC<PopupProps> = ({ open, children, className = "", handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      className='flex justify-center items-center w-full h-full'
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
    >
      <Box
        className={cn("relative w-full max-w-lg h-fit max-h-screen bg-white p-4 rounded shadow-lg overflow-y-auto", className)}
      >
        <div id="popup-description">{children}</div>
        <div className="absolute top-2 right-2">
          <CircularButton onClick={handleClose} size="sm" looks="frame" aria-label="閉じる">
            閉じる
          </CircularButton>
        </div>
      </Box>
    </Modal>
  );
};

export default Popup;