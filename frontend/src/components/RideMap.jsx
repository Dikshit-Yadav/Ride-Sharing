import { useRide } from "../context/RideContext";
import LocationMap from "./LocationMap"
import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";


function RideMap() {

    const {
        sourceLoc, setSourceLoc,
        destLoc, setDestLoc,
        setSource,
        setDestination,
        selecting,
        routeData,
        setRouteData,
        distance,
        duration
    } = useRide();
    let LOCATIONIQ_KEY = "pk.c3888526c247eef962f5eaa5f35860fb"
    return (
        <div className="ride-map">

            {routeData ? (
                <>
                    <MapContainer
                        center={[sourceLoc.lat, sourceLoc.lng]}
                        zoom={7}
                        style={{ height: "350px", borderRadius: "10px" }}
                    >
                        <TileLayer
                            url={`https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_KEY}`}
                        />

                        <Marker position={[sourceLoc.lat, sourceLoc.lng]} />
                        <Marker position={[destLoc.lat, destLoc.lng]} />

                        <GeoJSON data={routeData} />
                    </MapContainer>

                    <div style={{ marginTop: "10px" }}>
                        <p><strong>Distance:</strong> {distance} km</p>
                        <p><strong>Estimated Time:</strong> {duration} minutes</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRouteData(null)}
                        style={{ marginTop: "10px" }}
                    >
                        Change Route
                    </button>
                </>
            ) : (
                <LocationMap
                    location={selecting === "source" ? sourceLoc : destLoc}
                    onSelect={(place) => {
                        if (selecting === "source") {
                            setSource(place.address);
                            setSourceLoc(place);
                        } else {
                            setDestination(place.address);
                            setDestLoc(place);
                        }
                    }}
                />
            )}
        </div>
    )
}

export default RideMap;