import React from "react";

import { IconButton, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const StyledModalContext = styled("div")(({ theme }) => ({
  position: "fixed",
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 10000,
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
  const [Component, setComponent] = React.useState<React.ReactNode | null>(undefined);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ModalContext.Provider value={{ handleOpen, handleClose, setComponent }}>
      {open && (
        <StyledModalContext>
          <IconButton style={{ position: "absolute", top: "2rem", right: "2rem", border: "1px solid white" }} onClick={handleClose}>
            <CloseIcon style={{ color: "white", fontSize: "4rem" }} />
          </IconButton>

          {Component}
        </StyledModalContext>
      )}
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
