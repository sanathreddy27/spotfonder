import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitBounds({ fromCoords, toCoords }) {
  const map = useMap();

  useEffect(() => {
    if (!fromCoords || !toCoords) return;

    map.fitBounds([
      [fromCoords.lat, fromCoords.lon],
      [toCoords.lat, toCoords.lon],
    ]);
  }, [fromCoords, toCoords, map]);

  return null;
}

function RouteMap({
  distance,
  time,
  fromCoords,
  toCoords,
}) {
  if (!fromCoords || !toCoords) {
    return (
      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8 shadow-lg">

      <h2 className="text-3xl font-bold mb-6">
        🗺 Route Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <div className="bg-slate-700 rounded-xl p-5">
          <h3 className="text-xl font-bold">
            📏 Distance
          </h3>

          <p className="text-3xl mt-2">
            {distance ? `${distance} km` : "Loading..."}
          </p>
        </div>

        <div className="bg-slate-700 rounded-xl p-5">
          <h3 className="text-xl font-bold">
            ⏱ Travel Time
          </h3>

          <p className="text-3xl mt-2">
            {time ? `${time} Hours` : "Loading..."}
          </p>
        </div>

      </div>

      <MapContainer
        center={[fromCoords.lat, fromCoords.lon]}
        zoom={6}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "20px",
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds
          fromCoords={fromCoords}
          toCoords={toCoords}
        />

        <Marker
          position={[
            fromCoords.lat,
            fromCoords.lon,
          ]}
        >
          <Popup>
            Current Location
          </Popup>
        </Marker>

        <Marker
          position={[
            toCoords.lat,
            toCoords.lon,
          ]}
        >
          <Popup>
            Destination
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}

export default RouteMap;