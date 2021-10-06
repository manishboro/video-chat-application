import React from "react";

import Snackbar from "@mui/material/Snackbar";
import { Alert, AlertColor } from "@mui/material";

interface SnackbarMessage {
  message: string;
  key: number;
}

interface AlertContextInterface {
  handleSnackbar(message: string): void;
  handleAlertProps(key: string, value: string | boolean): void;
}

interface AlertDataInterface {
  variant: "standard" | "filled" | "outlined";
  severity: AlertColor | undefined;
  showAlert: boolean;
}

const AlertContext = React.createContext<AlertContextInterface | null>(null);
export const useAlertContext = () => React.useContext(AlertContext);

const AlertContextProvider: React.FC = ({ children }) => {
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(undefined);
  const [open, setOpen] = React.useState(true);

  const [alertProps, setAlertProps] = React.useState<AlertDataInterface>({
    variant: "filled",
    severity: undefined,
    showAlert: false,
  });

  const handleAlertProps = (key: string, value: boolean | string) => setAlertProps((prev) => ({ ...prev, [key]: value }));

  const handleSnackbar = (message: string) => setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);

  const handleClose = (event: React.SyntheticEvent | MouseEvent, reason?: string) => {
    if (reason === "clickaway") return;
    handleAlertProps("showAlert", false);
  };

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && alertProps.showAlert) {
      // Close an active snack when a new one is added
      setOpen(false);
    }

    // eslint-disable-next-line
  }, [snackPack, messageInfo, open]);

  const handleExited = () => setMessageInfo(undefined);

  return (
    <AlertContext.Provider value={{ handleSnackbar, handleAlertProps }}>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={alertProps.showAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={5000}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} variant={alertProps.variant} severity={alertProps.severity} sx={{ width: "100%", fontSize: "1.7rem" }}>
          {messageInfo?.message}
        </Alert>
      </Snackbar>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContextProvider;
