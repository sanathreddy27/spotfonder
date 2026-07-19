import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { calculateTransport } from "../utils/transportCalculator";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RouteMap() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination");

  const [userLocation, setUserLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [transport, setTransport] = useState(null);

  // Google Maps Navigation
  const openGoogleMaps = (mode) => {
    if (!destinationLocation) return;

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${destinationLocation[0]},${destinationLocation[1]}` +
      `&travelmode=${mode}`;

    window.open(url, "_blank");
  };

  useEffect(() => {
    async function loadMap() {
      try {
        const current = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) =>
              resolve([
                position.coords.latitude,
                position.coords.longitude,
              ]),
            reject
          );
        });

        setUserLocation(current);

        const geoRes = await fetch(
          `http://localhost:5000/api/geocode?city=${encodeURIComponent(
            destination
          )}`
        );

        const geoData = await geoRes.json();

        if (!geoData.success) return;

        const dest = [geoData.latitude, geoData.longitude];

        setDestinationLocation(dest);

        const routeRes = await fetch(
          `http://localhost:5000/api/route?startLat=${current[0]}&startLon=${current[1]}&endLat=${dest[0]}&endLon=${dest[1]}`
        );

        const routeData = await routeRes.json();

        if (routeData.success) {
          const points = routeData.geometry.coordinates.map(
            ([lon, lat]) => [lat, lon]
          );

          setRoute(points);

          const km = routeData.distance / 1000;

          setDistance(km.toFixed(1));

          setTravelTime((routeData.time / 3600).toFixed(1));

          setTransport(calculateTransport(km));
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadMap();
  }, [destination]);

  if (!userLocation || !destinationLocation) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-3xl">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">

      <div className="text-center text-white py-6">
        <h1 className="text-5xl font-bold">
          🗺 Route Planner
        </h1>

        <h2 className="text-2xl mt-3 text-blue-400">
          Destination: {destination}
        </h2>
      </div>

      <MapContainer
        center={userLocation}
        zoom={6}
        style={{
          height: "75vh",
          width: "90%",
          margin: "auto",
          borderRadius: "20px",
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={userLocation} icon={markerIcon}>
          <Popup>📍 Your Current Location</Popup>
        </Marker>

        <Marker position={destinationLocation} icon={markerIcon}>
          <Popup>🏔 {destination}</Popup>
        </Marker>

        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#2563eb",
              weight: 5,
            }}
          />
        )}
      </MapContainer>

      {/* Distance & Time */}

      <div className="max-w-5xl mx-auto mt-6 grid grid-cols-2 gap-6 text-white">

        <div className="bg-slate-800 rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold">📏 Distance</h2>

          <p className="text-3xl text-green-400 mt-3">
            {distance} km
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold">⏱ Travel Time</h2>

          <p className="text-3xl text-blue-400 mt-3">
            {travelTime} hrs
          </p>
        </div>

      </div>

      {/* Google Maps Navigation */}

      <div className="max-w-7xl mx-auto mt-8 px-6">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          🧭 Start Navigation
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <button
            onClick={() => openGoogleMaps("driving")}
            className="bg-blue-600 hover:bg-blue-700 rounded-2xl py-5 text-white font-bold text-xl transition hover:scale-105"
          >
            🚗
            <br />
            Drive
          </button>

          <button
            onClick={() => openGoogleMaps("walking")}
            className="bg-green-600 hover:bg-green-700 rounded-2xl py-5 text-white font-bold text-xl transition hover:scale-105"
          >
            🚶
            <br />
            Walk
          </button>

          <button
            onClick={() => openGoogleMaps("bicycling")}
            className="bg-orange-500 hover:bg-orange-600 rounded-2xl py-5 text-white font-bold text-xl transition hover:scale-105"
          >
            🚴
            <br />
            Bike
          </button>

          <button
            onClick={() => openGoogleMaps("transit")}
            className="bg-purple-600 hover:bg-purple-700 rounded-2xl py-5 text-white font-bold text-xl transition hover:scale-105"
          >
            🚌
            <br />
            Transit
          </button>

        </div>

      </div>

      {/* Transport Cards */}

      {transport && (
        <div className="max-w-7xl mx-auto mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pb-10">

          <div className="bg-slate-800 rounded-2xl p-6 text-center text-white">
            <div className="text-5xl">🚗</div>
            <h3 className="text-xl font-bold mt-3">Car</h3>
            <p className="mt-2">₹{transport.car.price}</p>
            <p>{transport.car.time} hrs</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 text-center text-white">
            <div className="text-5xl">🚌</div>
            <h3 className="text-xl font-bold mt-3">Bus</h3>
            <p className="mt-2">₹{transport.bus.price}</p>
            <p>{transport.bus.time} hrs</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 text-center text-white">
            <div className="text-5xl">🚆</div>
            <h3 className="text-xl font-bold mt-3">Train</h3>
            <p className="mt-2">₹{transport.train.price}</p>
            <p>{transport.train.time} hrs</p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-center text-white">
            <div className="text-5xl">✈</div>
            <h3 className="text-xl font-bold mt-3">Flight ⭐</h3>
            <p className="mt-2">₹{transport.flight.price}</p>
            <p>{transport.flight.time} hrs</p>
          </div>

        </div>
      )}

    </div>
  );
}

export default RouteMap;