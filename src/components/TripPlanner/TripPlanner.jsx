import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCities } from "../../api/geoapify";

function TripPlanner() {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState("");
  const [budget, setBudget] = useState("");

  // ⭐ NEW STATES (Step 6.1.1)
  const [tripType, setTripType] = useState("Nature");
  const [transport, setTransport] = useState("Any");

  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const handlePlanTrip = () => {
    if (
      !currentLocation ||
      !destination ||
      !travelDate ||
      !travelers ||
      !budget
    ) {
      alert("Please fill all required fields.");
      return;
    }

    navigate("/trip-result", {
      state: {
        currentLocation,
        destination,
        travelDate,
        returnDate,
        travelers,
        budget,
      },
    });
  };

  const handleCurrentLocationChange = async (e) => {
    const value = e.target.value;
    setCurrentLocation(value);

    if (value.length > 2) {
      const cities = await searchCities(value);
      setCurrentSuggestions(cities);
    } else {
      setCurrentSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);

    if (value.length > 2) {
      const cities = await searchCities(value);
      setDestinationSuggestions(cities);
    } else {
      setDestinationSuggestions([]);
    }
  };

  return (
    <section className="bg-slate-900 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-3xl p-8 shadow-2xl">

        <h2 className="text-4xl font-bold text-center mb-8">
          🧳 Plan Your Trip
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Current Location */}
          <div className="relative">
            <label className="block mb-2 font-medium">
              Current Location
            </label>

            <input
              type="text"
              placeholder="Enter your current city"
              value={currentLocation}
              onChange={handleCurrentLocationChange}
              className="w-full p-4 rounded-xl bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {currentSuggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-slate-700 rounded-xl mt-2 shadow-lg max-h-60 overflow-y-auto">
                {currentSuggestions.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-slate-600 cursor-pointer"
                    onClick={() => {
                      const cityName =
                        city.properties.city ||
                        city.properties.county ||
                        city.properties.state ||
                        city.properties.formatted;

                      setCurrentLocation(cityName);
                      setCurrentSuggestions([]);
                    }}
                  >
                    📍 {city.properties.formatted}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="relative">
            <label className="block mb-2 font-medium">
              Destination
            </label>

            <input
              type="text"
              placeholder="Where do you want to go?"
              value={destination}
              onChange={handleDestinationChange}
              className="w-full p-4 rounded-xl bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {destinationSuggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-slate-700 rounded-xl mt-2 shadow-lg max-h-60 overflow-y-auto">
                {destinationSuggestions.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-slate-600 cursor-pointer"
                    onClick={() => {
                      const cityName =
                        city.properties.city ||
                        city.properties.county ||
                        city.properties.state ||
                        city.properties.formatted;

                      setDestination(cityName);
                      setDestinationSuggestions([]);
                    }}
                  >
                    📍 {city.properties.formatted}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Travel Date */}
          <div>
            <label className="block mb-2 font-medium">
              Travel Date
            </label>

            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-700"
            />
          </div>

          {/* Return Date */}
          <div>
            <label className="block mb-2 font-medium">
              Return Date
            </label>

            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-700"
            />
          </div>

          {/* Travelers */}
          <div>
            <label className="block mb-2 font-medium">
              Travelers
            </label>

            <input
              type="number"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-700"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block mb-2 font-medium">
              Budget (₹)
            </label>

            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-700"
            />
          </div>

        </div>

        <button
          onClick={handlePlanTrip}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-xl font-bold transition"
        >
          🚀 Plan My Trip
        </button>

      </div>
    </section>
  );
}

export default TripPlanner;