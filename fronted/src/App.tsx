import { Route, Routes } from "react-router-dom";

import Subscribe from "./pages/subscribe";
import ReviewList from "./pages/reviewList";

function App() {
  return (
    <Routes>
      <Route element={<Subscribe />} path="/" />
      <Route element={<ReviewList />} path="/reviewList" />
    </Routes>
  );
}

export default App;
