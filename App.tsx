import React from "react";

import RootNavigation from "./Components/RootNavigation";
import AuthProvider from "./Components/AuthProvider";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
};

export default App;