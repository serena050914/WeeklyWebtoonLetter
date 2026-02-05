import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="light flex flex-col w-full px-6">
      <BrowserRouter>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
    </div>
  </React.StrictMode>,
);
