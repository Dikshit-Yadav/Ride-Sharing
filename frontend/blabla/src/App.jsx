import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
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
import ProtectedRouteWrapper from "./components/ProtectRouter";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isEmail, setIsEmail] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const email = localStorage.getItem("email");
    if(email){
      setIsEmail(true);
    }else{
      setIsEmail(false);
    }

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }


    setLoadingAuth(false);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-ride" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
            loading={loadingAuth}>
            <CreateRide />
          </ProtectedRouteWrapper>
        } />
        <Route path="/my-rides" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
            loading={loadingAuth}>
            <MYRides />
          </ProtectedRouteWrapper>


        } />
        <Route path="/forget" element={
            <ForgetPassword/>
          }/>

        <Route path="/reset-password" element={
          <ProtectedRouteWrapper
            isEmail={isEmail}
          >
            <ResetPassword />
          </ProtectedRouteWrapper>
        } />

        <Route path="/register-vehicle" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
            loading={loadingAuth}>
            <VehicleRegister />
          </ProtectedRouteWrapper>
        } />

        <Route path="/publiced-rides" element={

          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
            loading={loadingAuth}>
            <PublicedRide />
          </ProtectedRouteWrapper>
        } />

        <Route path="/rides" element={<FindRide />} />
        <Route path="/ride/book" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
            loading={loadingAuth}>
            <BookRide />
          </ProtectedRouteWrapper>
        } />

        <Route path="/my-profile" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
            loading={loadingAuth}>
            <MyProfile />
          </ProtectedRouteWrapper>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRouteWrapper
            isLoggedIn={isLoggedIn}
            loading={loadingAuth}>
            <EditProfile />
          </ProtectedRouteWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
