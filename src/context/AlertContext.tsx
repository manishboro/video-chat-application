import React from "react";

import { SnackbarKey, SnackbarProvider, useSnackbar, VariantType } from "notistack";

export interface SnackbarContextTypes {
  setStateSnackbarContext: (message: string, variant: VariantType) => SnackbarKey;
}

const SnackbarContext = React.createContext<SnackbarContextTypes | null>(null);
export const useAlertContext = () => React.useContext(SnackbarContext);

const MyApp = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const setStateSnackbarContext = (message: string, variant: VariantType) => enqueueSnackbar(message, { variant });

  return <SnackbarContext.Provider value={{ setStateSnackbarContext }}>{children}</SnackbarContext.Provider>;
};

const PageAlert: React.FC = ({ children }) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp>{children}</MyApp>
    </SnackbarProvider>
  );
};

export default PageAlert;
