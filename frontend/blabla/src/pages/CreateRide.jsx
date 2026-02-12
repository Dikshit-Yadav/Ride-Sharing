import "../style/CreatRide.css"
import { RideProvider } from "../context/RideContext";
import Navbar from "../components/Navbar";
import CreateRideform from "../components/CreateRideForm";
import RideMap from "../components/RideMap";

function CreateRide() {
  return (
  <>
  <Navbar />
  <RideProvider>
    <div className="container">
      <div className="ride-layout">
        <CreateRideform />
        <RideMap />
      </div>
    </div>
  </RideProvider>
  </>
  )
}

export default CreateRide;