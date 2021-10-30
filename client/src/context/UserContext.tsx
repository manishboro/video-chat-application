import React from "react";

import { getItemFromStorage } from "../utils/localStorage";

interface UserContextInterface {
  displayName: string;
  setDisplayName: React.Dispatch<React.SetStateAction<string>>;
}

const UserCtx = React.createContext<UserContextInterface | null>(null);

export const useUserContext = () => React.useContext(UserCtx);

/*
  Task -
  Retrieving displayName, myAudioBool and myVideoBool stored in localStorage.
*/

const UserContextProvider: React.FC = ({ children }) => {
  const [displayName, setDisplayName] = React.useState("");

  React.useEffect(() => {
    if (getItemFromStorage("displayName")) {
      setDisplayName(getItemFromStorage("displayName") ?? "");
    }
  }, []);

  return <UserCtx.Provider value={{ displayName, setDisplayName }}>{children}</UserCtx.Provider>;
};

export default UserContextProvider;
