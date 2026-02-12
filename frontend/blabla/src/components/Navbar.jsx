import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../style/Home.css";
import { io } from "socket.io-client";
import API from "../services/api";

const socket = io("http://localhost:4550", {
  transports: ["websocket"],
  withCredentials: true
});

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    socket.on("booking", (data) => {
      setNotifications((e) => [data, ...e])
    })
    return () => {
      socket.off("booking");
    }

  }, [user]);

  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    socket.on("bookingStatus", (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => socket.off("bookingStatus");
  }, [user]);

  const handleConfirm = async (notification) => {
    try {
      await API.put(`/ride/confirm/${notification.bookingId}`, {}, {
        withCredentials: true
      });

      setNotifications(e =>
        e.filter(n => n.bookingId !== notification.bookingId)
      );

      alert("Booking confirmed!");
    } catch (err) {
      console.error(err);
    }
  };

  const handelReject = async (notification) => {
    try {
      await API.put(`/ride/reject/${notification.bookingId}`, {}, {
        withCredentials: true
      });
      setNotifications(e => 
        e.filter(n => n.bookingId !== notification.bookingId)
      );
      alert("Booking rejected!");
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async() => {
    try{
      await API.get("/auth/logout");
      const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/login");
    }
    }catch(err){
      console.error(err);
    }
    
  };

  return (
    <nav className="navbar">
      <h1 className="logo clickable" onClick={() => navigate("/")}>
        blaBlaCar
      </h1>

      {!user ? (
        <div className="navbar-btns">
          <button className="lgn-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="rgs-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      ) : (
        <div className="navbar-actions">
          <div className="user-menu">
            <div
              className="notification-icon clickable"
              onClick={() => setOpenNotifications(!openNotifications)}
            >
              <i className="fa-regular fa-bell"></i>
              {
                notifications.length > 0 && (
                  <span className="notification-count">{notifications.length}</span>
                )}
            </div>
            <span
              className="name clickable"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {user.name}
            </span>

            {openMenu && (
              <div className="dropdown">
                <button onClick={()=>{
                  navigate("/my-profile")
                }}>My Profile</button>
                <button
                  className="clr"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/register-vehicle");
                  }}
                >
                  Register Vehicle
                </button>

                <button
                  className="clr"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/my-rides");
                  }}
                >
                  My Rides
                </button>

                <button className="clr" onClick={() => {
                  setOpenMenu(false)
                  navigate("/publiced-rides")
                }}>Publiced Rides</button>


                <button className="danger" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
          {openNotifications && (
            <div className="notifications-popup">
              <h4>Notifications</h4>

              {notifications.length == 0 ? (<p>No notifications</p>) : (
                notifications.map((n, i) => (
                  <div key={i} className="notification-item">
                    <span>{n.message}</span>

                    {n.type === "BOOKING_REQUEST" && (
                      <div className="notification-actions">
                        <i
                          className="fa-solid fa-x clickable"
                          onClick={() => handelReject(n)}
                        ></i>

                        <i
                          className="fa-solid fa-check clickable"
                          onClick={() => handleConfirm(n)}
                        ></i>
                      </div>
                    )}
                  </div>
                ))

              )}
              <button
                className="clr"
                onClick={() => setOpenNotifications(false)}
              >
                Close
              </button>
            </div>
          )}

        </div>
      )}
    </nav>
  );
}

export default Navbar;
