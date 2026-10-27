import React from "react";

import RootNavigation from "./Components/RootNavigation";
import AuthProvider from "./Components/AuthProvider";
import SocketProvider  from "./Components/SocketProvider";
import HealthCheckProvider from "./Components/HealthCheckProvider";

const App: React.FC = () => {
  return (
    <HealthCheckProvider>
      <AuthProvider>
        <SocketProvider>
          <RootNavigation />
        </SocketProvider>
      </AuthProvider>
    </HealthCheckProvider>
  );
};

export default App;