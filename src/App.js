import React from "react";
import Route from "./routes";

import "./assets/styles/animation.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function App() {
  return (
    <React.Fragment>
      <React.StrictMode>
        <Route />
      </React.StrictMode>
    </React.Fragment>
  );
}

export default App;
