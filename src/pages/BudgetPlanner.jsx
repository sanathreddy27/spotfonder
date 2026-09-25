import { useState } from "react";

function BudgetPlanner() {
  const [destination, setDestination] = useState("Munnar");
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:5000/api/trip-planner?destination=${encodeURIComponent(
          destination
        )}&days=${days}`
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Unable to load trip plan."
        );
      }

      setItinerary(data.itinerary || []);
    } catch (error) {
      console.error("❌ Trip Planner Error:", error);

      setError(
        "Unable to load the trip plan. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-3">
          Plan My Trip
        </h1>

        <p className="text-slate-300 mb-8">
          Build your trip using SpotFonder travel knowledge.
        </p>

        <div className="bg-slate-800 rounded-2xl p-6 mb-8">

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Destination
              </label>

              <input
                type="text"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
                className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white outline-none"
                placeholder="Enter destination"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Trip duration
              </label>

              <select
                value={days}
                onChange={(e) =>
                  setDays(Number(e.target.value))
                }
                className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white outline-none"
              >
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
              </select>
            </div>

          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={loading || !destination.trim()}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Generate Trip Plan"}
          </button>

        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {itinerary.length > 0 && (
          <div className="space-y-6">

            {itinerary.map((day) => (
              <div
                key={day.day}
                className="bg-slate-800 rounded-2xl p-6"
              >

                <h2 className="text-2xl font-bold">
                  Day {day.day}
                </h2>

                <p className="text-blue-400 mt-1">
                  {day.theme}
                </p>

                <div className="mt-5 space-y-3 text-slate-300">

                  <p>
                    <strong className="text-white">
                      Morning:
                    </strong>{" "}
                    {day.morning?.length
                      ? day.morning
                          .map((place) => place.name)
                          .join(", ")
                      : "Information not available"}
                  </p>

                  <p>
                    <strong className="text-white">
                      Afternoon:
                    </strong>{" "}
                    {day.afternoon?.length
                      ? day.afternoon
                          .map((place) => place.name)
                          .join(", ")
                      : "Information not available"}
                  </p>

                  <p>
                    <strong className="text-white">
                      Evening:
                    </strong>{" "}
                    {day.evening?.name ||
                      "Information not available"}
                  </p>

                  <p>
                    <strong className="text-white">
                      Weather advice:
                    </strong>{" "}
                    {day.weatherAdvice ||
                      "Information not available"}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default BudgetPlanner;