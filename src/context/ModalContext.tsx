import React from "react";

import { Backdrop, IconButton, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

const StyledModalContext = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

interface ModalContextInterface {
  handleOpen(): void;
  handleClose(): void;
  setComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

const ModalContext = React.createContext<ModalContextInterface | null>(null);

export const useModalContext = () => React.useContext(ModalContext);

const ModalContextProvider: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [Component, setComponent] = React.useState<any>(undefined);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ModalContext.Provider value={{ handleOpen, handleClose, setComponent }}>
      <StyledModalContext
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <div>
            <IconButton
              sx={{
                position: "absolute",
                top: "2rem",
                right: "2rem",
                backgroundColor: "white",

                "&:hover": { backgroundColor: "white" },
              }}
              onClick={handleClose}
            >
              <CloseIcon sx={{ color: "red" }} />
            </IconButton>
            {Component}
          </div>
        </Fade>
      </StyledModalContext>

      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
