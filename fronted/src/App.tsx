import { Route, Routes } from "react-router-dom";

import SubscribePage from "./pages/subscribePage";
import Unsubscribe from "./pages/unsubscribePage";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#FFF7ED] via-[#FDF2F8] to-[#FFFFFF]">
      <div className="max-w-lg w-full min-h-screen pt-12 px-4">
        <Routes>
          <Route element={<SubscribePage />} path="/" />
          <Route element={<Unsubscribe />} path="/unsubscribe" />
        </Routes>
      </div>
    </div>
  );
}

export default App;
