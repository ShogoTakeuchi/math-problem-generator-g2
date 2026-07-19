import { Navigate, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { PracticePage } from "./pages/PracticePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/practice/:type" element={<PracticePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
