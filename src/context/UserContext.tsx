import React from "react";
import EnterNameForm from "../components/enter-name-form";

import { getItemFromStorage } from "../utils/localStorage";

interface UserContextInterface {
  displayName: string;
  audioOnBool: boolean;
  videoOnBool: boolean;
  setDisplayName: React.Dispatch<React.SetStateAction<string>>;
  setAudioOnBool: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoOnBool: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserCtx = React.createContext<UserContextInterface | null>(null);

export const useUserContext = () => React.useContext(UserCtx);

/*
  Task -
  Retrieving displayName, myAudioBool and myVideoBool stored in localStorage.
*/

const UserContextProvider: React.FC = ({ children }) => {
  const [displayName, setDisplayName] = React.useState("");
  const [audioOnBool, setAudioOnBool] = React.useState(true);
  const [videoOnBool, setVideoOnBool] = React.useState(true);

  // Flipping states to run the below useEffect
  const [trigger, setTrigger] = React.useState(false);

  React.useEffect(() => {
    if (getItemFromStorage("displayName")) setDisplayName(getItemFromStorage("displayName") ?? "");

    if (getItemFromStorage("audioOnBool")) setAudioOnBool(getItemFromStorage("audioOnBool") === "true" ? true : false);

    if (getItemFromStorage("videoOnBool")) setVideoOnBool(getItemFromStorage("videoOnBool") === "true" ? true : false);
  }, [trigger]);

  return (
    <UserCtx.Provider
      value={{
        displayName,
        audioOnBool,
        videoOnBool,
        setDisplayName,
        setAudioOnBool,
        setVideoOnBool,
      }}
    >
      {displayName ? children : <EnterNameForm setTrigger={setTrigger} />}
    </UserCtx.Provider>
  );
};

export default UserContextProvider;
