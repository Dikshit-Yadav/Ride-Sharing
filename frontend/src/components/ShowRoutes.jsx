import { useEffect } from "react";
import { useRide } from "../context/RideContext";
import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});



function ShowRoute() {

    const {
        routes, setRoutes,
        distance, setDistance,
        duration, setDuration,
        sourceLoc,
        destLoc
    } = useRide();

    const LOCATIONIQ_KEY = "pk.c3888526c247eef962f5eaa5f35860fb";

    const getRoute = async (start, end) => {
        try {
            const res = await fetch(
                `https://us1.locationiq.com/v1/directions/driving/${start.lng},${start.lat};${end.lng},${end.lat}?key=${LOCATIONIQ_KEY}&geometries=geojson&alternatives=true`
            );

            const data = await res.json();
            console.log(data);
            if (data.routes && data.routes.length > 0) {
                const formattedRoutes = data.routes.map(route => ({
                    distance: (route.distance / 1000).toFixed(2),
                    duration: (route.duration / 60).toFixed(0),
                    geometry: route.geometry
                }));

                setRoutes(formattedRoutes);
            }
        } catch (err) {
            console.error("Route fetch failed");
        }
    };
    useEffect(() => {
        if (sourceLoc && destLoc) {
            getRoute(sourceLoc, destLoc);
        }
    }, [sourceLoc, destLoc]);


    return (
        <>
            {distance && (
                <div className="route-info">
                    <h4>Route Info</h4>
                    <p>Distance: {distance} km</p>
                    <p>Estimated Time: {duration} minutes</p>
                </div>
            )}

            {(sourceLoc || destLoc) && (
                <>
                    <MapContainer
                        center={
                            sourceLoc
                                ? [sourceLoc.lat, sourceLoc.lng]
                                : [destLoc.lat, destLoc.lng]
                        }
                        zoom={13}
                        style={{ height: "400px", width: "100%", marginTop: "20px" }}
                    >
                        <TileLayer
                            url={`https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_KEY}`}
                        />

                        {sourceLoc && (
                            <Marker
                                position={[sourceLoc.lat, sourceLoc.lng]}
                                icon={markerIcon}
                            />
                        )}

                        {destLoc && (
                            <Marker
                                position={[destLoc.lat, destLoc.lng]}
                                icon={markerIcon}
                            />
                        )}

                        {routes.map((route, index) => (
                            <GeoJSON
                                key={index}
                                data={route.geometry}
                                style={{
                                    color: index === 0 ? "blue" : "gray",
                                    weight: index === 0 ? 5 : 3
                                }}
                            />
                        ))}
                    </MapContainer>
                    <div className="route-list">
                        {routes.map((route, index) => (
                            <div key={index}>
                                <p><b>Route {index + 1}</b></p>
                                <p>Distance: {route.distance} km</p>
                                <p>Time: {route.duration} min</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </>
    );
}


export default ShowRoute;