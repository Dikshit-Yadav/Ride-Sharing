import { useRide } from "../context/RideContext";
import LocationMap from "./LocationMap"

function RideMap() {

    const {
        sourceLoc, setSourceLoc,
        destLoc, setDestLoc,
        setSource,
        setDestination,
        selecting
    } = useRide();

    return (
        <div className="ride-map">
            <LocationMap
                location={selecting === "source"
                    ? sourceLoc : destLoc}
            onSelect={(place) => {
                if(selecting === "source"){
                    setSource(place.address);
                    setSourceLoc(place)
                }else{
                    setDestination(place.address);
                    setDestLoc(place)
                }
                }}
            />
        </div>
    )
}

export default RideMap;