import React from "react";
import { Route, Routes } from "react-router-dom";

import { routes } from "./routes";

function App() {
  return (
    <>
      <Routes>
        {routes.map((R) => (
          <Route key={R.name} path={R.path} element={R.element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
