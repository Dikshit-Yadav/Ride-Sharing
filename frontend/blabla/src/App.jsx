import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRide from "./pages/CreateRide"
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import VehicleRegister from "./pages/VehicleRegister";
import PublicedRide from "./pages/PublicedRide";
import FindRide from "./pages/FindRide";
import BookRide from "./pages/BookRide";
import MYRides from "./pages/MyRides";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-ride" element={<CreateRide />} />
        <Route path="/my-rides" element={<MYRides />} />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register-vehicle" element={<VehicleRegister />} />
        <Route path="/publiced-rides" element={<PublicedRide />} />
        <Route path="/rides" element={<FindRide />} />
        <Route path="/ride/book" element={<BookRide />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
