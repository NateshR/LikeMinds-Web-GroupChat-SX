import { useEffect, useState } from "react";
import "./App.css";
import RouteProvider from "./modules/components/routes";
import { UserContext } from "./modules/contexts/userContext";
import { initiateSDK } from "./sdkFunctions";

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [community, setCommunity] = useState();
  useEffect(() => {
    initiateSDK(false, "60d19927-8b66-4f78-af91-c6005950847c", "Earfuls12")
      .then((res: any) => {
        setCommunity(res?.data?.community);
        setCurrentUser(res?.data?.user);
        sessionStorage.setItem("communityId", res?.data?.community?.id);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  }, []);
  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        community,
        setCommunity,
      }}
    >
      <RouteProvider />
    </UserContext.Provider>
  );
}

export default App;
