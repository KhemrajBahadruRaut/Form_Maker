import { BrowserRouter, Route, Routes } from "react-router-dom";
import Build from "../Pages/Build"
import Settings from "../Pages/Settings";
import Publish from "../Pages/Publish";
import FormViewer from "../Form_view_userside/FormViewer";
import Dashboard from "../Pages/Dashboard";
import Responses from "../Pages/Responses";
import AdminLogin from "../Pages/AdminLogin";
import ProtectedRoute from "./ProtectedRoute";

const MyRoutes = () => {
  return (
   <>
   <BrowserRouter>
      <Routes>
        {/* Public routes — no login required */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/form/:formNumber" element={<FormViewer />} />

        {/* Protected admin routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/build/:formNumber" element={<ProtectedRoute><Build /></ProtectedRoute>} />
        <Route path="/settings/:formNumber" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/publish/:formNumber" element={<ProtectedRoute><Publish /></ProtectedRoute>} />
        <Route path="/responses/:formNumber" element={<ProtectedRoute><Responses /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
   </>
  )
}

export default MyRoutes
