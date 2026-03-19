import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { useState, useEffect } from "react";
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
import Chat from "./pages/Chat";


function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-ride" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}>
            <CreateRide />
          </ProtectedRouteWrapper>
        } />
        <Route path="/my-rides" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
          >
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
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
          >
            <VehicleRegister />
          </ProtectedRouteWrapper>
        } />

        <Route path="/publiced-rides" element={

          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
          >
            <PublicedRide />
          </ProtectedRouteWrapper>
        } />

        <Route path="/rides" element={<FindRide />} />
        <Route path="/ride/book" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
          >
            <BookRide />
          </ProtectedRouteWrapper>
        } />

        <Route path="/my-profile" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
          >
            <MyProfile />
          </ProtectedRouteWrapper>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
          >
            <EditProfile />
          </ProtectedRouteWrapper>
        } />
        <Route path="/chat/:userId" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
          >
            <Chat />
          </ProtectedRouteWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
