import "../style/CreatRide.css"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const API_KEY = "pk.c3888526c247eef962f5eaa5f35860fb";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position]);

  return null;
}

function MapClickHandler({ onSelect }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      const res = await fetch(
        `https://api.locationiq.com/v1/reverse?key=${API_KEY}&lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      onSelect({
        address: data.display_name,
        lat,
        lng,
      });
    },
  });

  return null;
}

export default function LocationMap({ location, onSelect }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (location?.lat && location?.lng) {
      setPosition([location.lat, location.lng]);
    }
  }, [location]);

  return (
    <MapContainer className="mpContainer"
      center={position || [20.5937, 78.9629]}
      zoom={position ? 13 : 5}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        url={`https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${API_KEY}`}
      />

      {position && <Marker position={position} icon={markerIcon} />}
      {position && <FlyToLocation position={position} />}

      <MapClickHandler
        onSelect={(place) => {
          setPosition([place.lat, place.lng]);
          onSelect(place);
        }}
      />
    </MapContainer>
  );
}
