import React from "react";

import RootNavigation from "./Components/RootNavigation";
import AuthProvider from "./Components/AuthProvider";
import SocketProvider  from "./Components/SocketProvider";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <RootNavigation />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;