import React from "react";
// import AuthForm from "../components/auth-form";

// import { useAlertContext } from "./AlertContext";

const AuthContextProvider: React.FC = ({ children }) => {
  // const alert = useAlertContext();
  // const [authorized, setAuthorized] = React.useState(false);

  // return (
  //   <>
  //     {process.env.NODE_ENV === "development" || authorized ? (
  //       children
  //     ) : (
  //       <AuthForm alert={alert} setAuthorized={setAuthorized} />
  //     )}
  //   </>
  // );

  return <>{children}</>;
};

export default AuthContextProvider;
