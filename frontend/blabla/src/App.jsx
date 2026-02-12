import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { useState } from "react";
import Cookies from "js-cookie";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
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
import ProtectedRouteWrapper from "./components/ProtectRouter";


function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("token"));
  const [isEmail, setIsEmail] = useState(!!localStorage.getItem("email"));
  const [loadingAuth, setLoadingAuth] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-ride" element={
          <ProtectedRouteWrapper>
            <CreateRide />
          </ProtectedRouteWrapper>
        } />
        <Route path="/my-rides" element={
          <ProtectedRouteWrapper>
            <MYRides />
          </ProtectedRouteWrapper>


        } />
        <Route path="/forget" element={
          <ForgetPassword />
        } />

        <Route path="/reset-password" element={
          <ProtectedRouteWrapper requireEmail>
            <ResetPassword />
          </ProtectedRouteWrapper>
        } />

        <Route path="/register-vehicle" element={
          <ProtectedRouteWrapper>
            <VehicleRegister />
          </ProtectedRouteWrapper>
        } />

        <Route path="/publiced-rides" element={

          <ProtectedRouteWrapper>
            <PublicedRide />
          </ProtectedRouteWrapper>
        } />

        <Route path="/rides" element={<FindRide />} />
        <Route path="/ride/book" element={
          <ProtectedRouteWrapper>
            <BookRide />
          </ProtectedRouteWrapper>
        } />

        <Route path="/my-profile" element={
          <ProtectedRouteWrapper>
            <MyProfile />
          </ProtectedRouteWrapper>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRouteWrapper>
            <EditProfile />
          </ProtectedRouteWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
