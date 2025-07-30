import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
const App = React.lazy(() => import("./App.jsx"));

import loadingImg from '../weather.png'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<div className="loading">
      <div className="loader"></div>
    </div>}>
      <App />
    </Suspense>
  </StrictMode>
);
