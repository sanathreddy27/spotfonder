import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { getCoordinates } from "../../api/geocode";
import { getRoute } from "../../api/routing";

import AITripSummary from "../AITripSummary/AITripSummary";
import AIItinerary from "../AIItinerary/AIItinerary";
import RouteMap from "../RouteMap/RouteMap";
import TransportCards from "../TransportCards/TransportCards";
import WeatherCard from "../WeatherCard/WeatherCard";
import BudgetCard from "../BudgetCard/BudgetCard";
import Hotels from "../Hotels/Hotels";
import Restaurants from "../Restaurants/Restaurants";
import Attractions from "../Attractions/Attractions";

function TripResults() {
  const { state } = useLocation();

  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);

  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    async function loadRoute() {
      if (!state) return;

      const from = await getCoordinates(state.currentLocation);
      const to = await getCoordinates(state.destination);

      if (!from || !to) return;

      setFromCoords({
        lat: from.lat,
        lon: from.lon,
      });

      setToCoords({
        lat: to.lat,
        lon: to.lon,
      });

      const route = await getRoute(
        {
          lat: from.lat,
          lon: from.lon,
        },
        {
          lat: to.lat,
          lon: to.lon,
        }
      );

      if (route) {
        setRouteData(route);

        setDistance((route.properties.distance / 1000).toFixed(1));

        setTime((route.properties.time / 3600).toFixed(1));
      }
    }

    loadRoute();
  }, [state]);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">
          No Trip Data Found
        </h1>
      </div>
    );
  }

  return (
    <section className="bg-slate-900 text-white min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* AI Travel Summary */}
        <AITripSummary state={state} />

        {/* Trip Details */}
        <div className="bg-slate-800 rounded-3xl p-8 mb-8">

          <h2 className="text-4xl font-bold text-center mb-8">
            🎉 Your Trip
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-slate-700 p-5 rounded-xl">
              <h3 className="font-bold">📍 Current Location</h3>
              <p>{state.currentLocation}</p>
            </div>

            <div className="bg-slate-700 p-5 rounded-xl">
              <h3 className="font-bold">🎯 Destination</h3>
              <p>{state.destination}</p>
            </div>

            <div className="bg-slate-700 p-5 rounded-xl">
              <h3 className="font-bold">📅 Travel Date</h3>
              <p>{state.travelDate}</p>
            </div>

            <div className="bg-slate-700 p-5 rounded-xl">
              <h3 className="font-bold">📅 Return Date</h3>
              <p>{state.returnDate || "Not Selected"}</p>
            </div>

            <div className="bg-slate-700 p-5 rounded-xl">
              <h3 className="font-bold">👥 Travelers</h3>
              <p>{state.travelers}</p>
            </div>

            <div className="bg-slate-700 p-5 rounded-xl">
              <h3 className="font-bold">💰 Budget</h3>
              <p>₹ {state.budget}</p>
            </div>

            <div className="bg-slate-700 p-5 rounded-xl">
              <h3 className="font-bold">🌴 Trip Type</h3>
              <p>{state.tripType}</p>
            </div>

            <div className="bg-slate-700 p-5 rounded-xl">
              <h3 className="font-bold">🚆 Preferred Transport</h3>
              <p>{state.transport}</p>
            </div>

          </div>
        </div>

        {/* Route Map */}
        <RouteMap
          distance={distance}
          time={time}
          fromCoords={fromCoords}
          toCoords={toCoords}
          routeData={routeData}
        />

        {/* Transport */}
        <TransportCards />

        {/* Weather */}
        <WeatherCard destination={state.destination} />

        {/* Budget */}
        <BudgetCard budget={state.budget} />

        {/* Hotels */}
        <Hotels destination={state.destination} />

        {/* Restaurants */}
        <Restaurants destination={state.destination} />

        {/* Attractions */}
        <Attractions destination={state.destination} />

        {/* ⭐ AI Day-wise Itinerary */}
        <AIItinerary state={state} />

      </div>
    </section>
  );
}

export default TripResults;