import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import LoginCheck from "../Components/LoginCheck";
import Feedback from "../Components/Feedback";

export default function AllRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginCheck>
            <Feedback />
          </LoginCheck>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
