import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDestination } from "../api/destination";
import { calculateBudget } from "../utils/budgetCalculator";
import {
  saveFavorite,
  checkFavorite,
} from "../api/favorite";
import TripTimeline from "../components/Timeline/TripTimeline";

function DestinationDetails() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // State variables for budget estimation
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(3);
  const [transport, setTransport] = useState("car");
  const [budgetType, setBudgetType] = useState("standard");

  useEffect(() => {
    async function loadDestination() {
      try {
        const data = await getDestination(name);
        setDestination(data);
        
        // Check if this destination is already in the user's favorites
        const saved = await checkFavorite(data.name);
        setIsFavorite(!!saved);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDestination();
  }, [name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-3xl">
        Loading Destination...
      </div>
    );
  }

  // Calculate budget values based on state inputs right before rendering
  const budget = calculateBudget({
    days,
    travelers,
    transport,
    budgetType,
  });

  const handleSaveFavorite = async () => {
    if (isFavorite) return;

    try {
      await saveFavorite({
        name: destination.name,
        state: destination.state,
        image: destination.image,
        about: destination.about,
      });

      setIsFavorite(true);
      alert("❤️ Destination Saved!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Hero Image */}
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-[450px] object-cover"
      />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Name */}
        <h1 className="text-6xl font-bold">
          {destination.name}
        </h1>

        <p className="text-2xl text-gray-400 mt-3">
          📍 {destination.state}
        </p>

        {/* About */}
        <div className="bg-slate-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-bold mb-6">
            📖 About
          </h2>
          <p className="text-lg text-gray-300 leading-9">
            {destination.about}
          </p>
        </div>

        {/* Weather */}
        <div className="bg-slate-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-bold mb-6">
            🌤 Live Weather
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold">
                {destination.weather.temperature}°C
              </p>
              <p className="text-xl text-gray-400 mt-2">
                {destination.weather.weather}
              </p>
            </div>
            <div>
              <p>💧 Humidity: {destination.weather.humidity}%</p>
              <p>🌬 Wind: {destination.weather.wind} m/s</p>
            </div>
          </div>
        </div>

        {/* Attractions */}
        <div className="bg-slate-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-bold mb-8">
            ⭐ Top Attractions
          </h2>
          {destination.attractions.length === 0 ? (
            <p className="text-gray-400">
              No attractions found.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {destination.attractions.map((place, index) => (
                <div
                  key={index}
                  className="bg-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition duration-300"
                >
                  <img
                    src={
                      place.image ||
                      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg"
                    }
                    alt={place.name}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-yellow-400">
                      {place.name}
                    </h3>
                    <p className="text-gray-400 mt-3">
                      📍 {place.address || "Address unavailable"}
                    </p>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
                          "_blank"
                        )
                      }
                      className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700 py-3 rounded-xl font-bold"
                    >
                      🗺 View on Map
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hotels */}
        <div className="bg-slate-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-bold mb-8">
            🏨 Recommended Hotels
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {destination.hotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition duration-300"
              >
                <img
                  src={
                    hotel.image ||
                    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
                  }
                  alt={hotel.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-400">
                    {hotel.name}
                  </h3>
                  <p className="text-gray-400 mt-3">
                    📍 {hotel.address || "Address unavailable"}
                  </p>
                  <div className="flex justify-between items-center mt-5">
                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-bold">
                      Recommended
                    </span>
                    <span className="text-yellow-400 font-bold">
                      ⭐ Popular
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`,
                        "_blank"
                      )
                    }
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition"
                  >
                    🗺 View on Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div className="bg-slate-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-bold mb-8">
            🍽 Restaurants
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {destination.restaurants.map((restaurant, index) => (
              <div
                key={index}
                className="bg-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-pink-500/30 hover:scale-105 transition duration-300"
              >
                <img
                  src={
                    restaurant.image ||
                    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
                  }
                  alt={restaurant.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-pink-400">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-400 mt-3">
                    📍 {restaurant.address || "Address unavailable"}
                  </p>
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`,
                        "_blank"
                      )
                    }
                    className="w-full mt-6 bg-pink-600 hover:bg-pink-700 py-3 rounded-xl font-bold"
                  >
                    🗺 View on Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Trip Timeline */}
        <div className="bg-slate-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-bold mb-10">
            🗓 AI Trip Timeline
          </h2>
          <TripTimeline
            days={destination.itinerary.threeDays}
          />
        </div>

        {/* AI 5-Day Plan */}
        <div className="bg-slate-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-bold mb-8">
            🗓 AI 5-Day Trip Plan
          </h2>
          {destination.itinerary.fiveDays.map((day) => (
            <div
              key={day.day}
              className="bg-slate-700 rounded-2xl p-6 mb-6"
            >
              <h3 className="text-2xl font-bold text-green-400">
                Day {day.day}
              </h3>
              <p className="mt-3">
                🏨 Hotel: {day.hotel?.name}
              </p>
              
              {/* Morning */}
              {day.morning?.length > 0 && (
                <>
                  <h4 className="mt-4 font-bold text-yellow-400">
                    🌅 Morning
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {day.morning.map((place, index) => (
                      <li key={index}>📍 {place.name}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Afternoon */}
              {day.afternoon?.length > 0 && (
                <>
                  <h4 className="mt-4 font-bold text-green-400">
                    🌄 Afternoon
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {day.afternoon.map((place, index) => (
                      <li key={index}>📍 {place.name}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Evening */}
              {day.evening?.length > 0 && (
                <>
                  <h4 className="mt-4 font-bold text-purple-400">
                    ☕ Evening
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {day.evening.map((place, index) => (
                      <li key={index}>📍 {place.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Budget Planner Section */}
        <div className="bg-slate-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-bold mb-8">
            💰 Budget Planner
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block mb-2 font-bold">
                👥 Travelers
              </label>
              <input
                type="number"
                min="1"
                value={travelers}
                onChange={(e) =>
                  setTravelers(Number(e.target.value))
                }
                className="w-full bg-slate-700 rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">
                📅 Days
              </label>
              <select
                value={days}
                onChange={(e) =>
                  setDays(Number(e.target.value))
                }
                className="w-full bg-slate-700 rounded-xl p-3"
              >
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold">
                🚗 Transport
              </label>
              <select
                value={transport}
                onChange={(e) =>
                  setTransport(e.target.value)
                }
                className="w-full bg-slate-700 rounded-xl p-3"
              >
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="flight">Flight</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold">
                💰 Budget Type
              </label>
              <select
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value)}
                className="w-full bg-slate-700 rounded-xl p-3"
              >
                <option value="budget">Budget</option>
                <option value="standard">Standard</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>

          {/* Budget Summary Component */}
          <div className="mt-10 bg-slate-700 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-green-400 mb-6">
              💰 Estimated Trip Budget
            </h3>
            <div className="space-y-4 text-xl">
              <div className="flex justify-between">
                <span>🚗 Travel</span>
                <span>₹{budget.travel.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>🏨 Hotel</span>
                <span>₹{budget.hotel.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>🍽 Food</span>
                <span>₹{budget.food.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>🎟 Activities</span>
                <span>₹{budget.activities.toLocaleString()}</span>
              </div>
              <hr className="border-slate-500 my-4" />
              <div className="flex justify-between text-3xl font-bold text-yellow-400">
                <span>Total Budget</span>
                <span>₹{budget.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* AI Recommendation Section */}
          <div className="mt-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-6">
              🤖 AI Travel Recommendation
            </h2>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span>💰 Selected Budget</span>
                <span className="font-bold capitalize">{budgetType}</span>
              </div>
              <div className="flex justify-between">
                <span>👥 Travelers</span>
                <span className="font-bold">{travelers}</span>
              </div>
              <div className="flex justify-between">
                <span>📅 Trip Duration</span>
                <span className="font-bold">{days} Days</span>
              </div>
              <div className="flex justify-between">
                <span>🚗 Transport</span>
                <span className="font-bold capitalize">{transport}</span>
              </div>
              <div className="flex justify-between">
                <span>💵 Daily Budget</span>
                <span className="font-bold text-yellow-300">
                  ₹{Math.round(budget.total / days).toLocaleString()}
                </span>
              </div>
              <hr className="border-white/30 my-4" />
              <p className="leading-8 text-white">
                {budgetType === "budget" &&
                  "💡 Choose hostels, public transport and local restaurants to keep your trip affordable."}
                {budgetType === "standard" &&
                  "💡 A balanced choice with comfortable hotels, good restaurants and popular attractions."}
                {budgetType === "luxury" &&
                  "💡 Enjoy premium hotels, fine dining and private transport for a luxurious travel experience."}
              </p>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <button
          onClick={handleSaveFavorite}
          disabled={isFavorite}
          className={`w-full mt-10 py-5 rounded-2xl text-2xl font-bold transition ${
            isFavorite
              ? "bg-green-600 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {isFavorite ? "✅ Saved" : "❤️ Save Destination"}
        </button>

        <button
          onClick={() =>
            navigate(`/route-map?destination=${destination.name}`)
          }
          className="w-full mt-12 bg-gradient-to-r from-green-600 to-blue-600 py-5 rounded-2xl text-2xl font-bold hover:scale-105 transition"
        >
          🗺 View Map
        </button>

      </div>
    </div>
  );
}

export default DestinationDetails;