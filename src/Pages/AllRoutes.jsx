import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Feedback from "../Components/feedback";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Feedback />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
