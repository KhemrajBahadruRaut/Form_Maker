import { BrowserRouter, Route, Routes } from "react-router-dom";
import Build from "../Pages/Build"
import Settings from "../Pages/Settings";
import Publish from "../Pages/Publish";
import FormViewer from "../Form_view_userside/FormViewer";
import Dashboard from "../Pages/Dashboard";
import Responses from "../Pages/Responses";

const MyRoutes = () => {
  return (
   <>
   <BrowserRouter>
      <Routes>
        <Route path="/build/:formNumber" element={<Build />} />
        <Route path="/settings/:formNumber" element={<Settings />} />
        <Route path="/publish/:formNumber" element={<Publish />} />
        <Route path="/responses/:formNumber" element={<Responses />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/form/:formNumber" element={<FormViewer />} />
      </Routes>
    </BrowserRouter>
   </>
  )
}

export default MyRoutes
