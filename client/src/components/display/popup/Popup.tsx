import { Box, IconButton, Modal, SxProps } from "@mui/material";
import { FC, ReactNode } from "react";
import { Close } from "@mui/icons-material";

interface PopupProps {
  open: boolean;
  children: ReactNode;
  height?: string | number;
  props?: SxProps;
  centeredItem?: boolean;
  fixationCloseButton?: boolean;
  handleClose: () => void;
}

const Popup: FC<PopupProps> = ({ open, children, height = 'fit-content', centeredItem, fixationCloseButton, props, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '95%',
          maxWidth: 'lg', // MUIのテーマに基づくサイズ
          height,
          maxHeight: '95vh',
          overflow: 'auto',
          justifyContent: centeredItem ? 'center' : 'start',
          alignItems: centeredItem ? 'center' : 'start',
          ...props
        }}
      >
        <div id="popup-description">{children}</div>
        <IconButton
          onClick={handleClose}
          size="large"
          color="warning"
          sx={{
            position: fixationCloseButton ? 'fixed' : 'absolute',
            top: 8,
            right: 8
          }}
        >
          <Close />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default Popup;
