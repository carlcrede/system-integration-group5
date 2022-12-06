import React, { FunctionComponent } from "react";
import { AuthContext } from "./AuthContext";
import { useAuth } from "./hooks/useAuth";
import Router from "./Router";

const App: FunctionComponent = () => {
    const { getUserToken } = useAuth();

    return ( 
        <AuthContext.Provider value={{ getUserToken }}>
            <Router />
        </AuthContext.Provider>
     );
}
 
export default App;