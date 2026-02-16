import { Route, Routes } from "react-router-dom";

import SubscribePage from "./pages/subscribePage";
import UnsubscribePage from "./pages/unsubscribePage";
import RecentReviewPage from "./pages/recentReviewPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#FFF7ED] via-[#FDF2F8] to-[#FFFFFF]">
      <div className="max-w-3xl w-full min-h-screen py-12 px-4">
        <Routes>
          <Route element={<RecentReviewPage />} path="/" />
          <Route element={<SubscribePage />} path="/subscribe" />
          <Route element={<UnsubscribePage />} path="/unsubscribe" />
        </Routes>
      </div>
    </div>
  );
}

export default App;
