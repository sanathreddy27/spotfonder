import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAIRecommendations } from "../../api/ai";

function AITopPicks() {
  const navigate = useNavigate();

  console.log("✅ AITopPicks Component Loaded");

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        console.log("🚀 Fetching AI Recommendations...");

        const data = await getAIRecommendations();

        console.log("📦 AI Recommendations Received:", data);

        setRecommendations(data || []);
      } catch (error) {
        console.error("❌ Failed to load recommendations:", error);
        setError("Unable to load AI recommendations.");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-900 py-16 px-6 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            🤖 AI Top Picks Today
          </h2>

          <p className="text-xl text-gray-400">
            🌍 Finding the best destinations for today...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-slate-900 py-16 px-6 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            🤖 AI Top Picks Today
          </h2>

          <p className="text-red-400">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return (
      <section className="bg-slate-900 py-16 px-6 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            🤖 AI Top Picks Today
          </h2>

          <p className="text-gray-400">
            No recommendations available right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 py-16 px-6 text-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-4xl md:text-5xl font-bold">
            🤖 AI Top Picks Today
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Live recommendations based on current travel conditions
          </p>

        </div>

        {/* Cards */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {recommendations.map((place, index) => (

            <div
              key={index}
              className="bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition duration-300"
            >

              {/* Image */}

              <div className="relative h-56">

                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />

                {/* AI Score */}

                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full">

                  <span className="text-yellow-400 font-bold">
                    ⭐ {place.aiScore}
                  </span>

                </div>

              </div>

              {/* Content */}

              <div className="p-6">

                {/* Destination */}

                <h3 className="text-2xl font-bold">
                  {place.name}
                </h3>

                <p className="text-blue-400 mt-1">
                  📍 {place.state}
                </p>

                {/* Category */}

                <div className="mt-4">

                  <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">
                    {place.category}
                  </span>

                </div>

                {/* Weather */}

                <div className="mt-5 bg-slate-700/60 rounded-xl p-4">

                  <div className="flex justify-between">

                    <span>
                      🌤️ {place.weather}
                    </span>

                    <span className="font-bold">
                      {place.temperature}°C
                    </span>

                  </div>

                </div>

                {/* Reason */}

                <p className="text-gray-300 mt-5 leading-relaxed">
                  {place.reason}
                </p>

                {/* Travel Reason */}

                <p className="text-gray-400 mt-3 text-sm">
                  💡 {place.travelReason}
                </p>

                {/* Information */}

                <div className="grid grid-cols-3 gap-2 mt-5 text-center text-sm">

                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="font-bold">
                      {place.attractionCount}
                    </div>
                    <div className="text-gray-400">
                      Attractions
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="font-bold">
                      {place.hotelCount}
                    </div>
                    <div className="text-gray-400">
                      Hotels
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="font-bold">
                      {place.restaurantCount}
                    </div>
                    <div className="text-gray-400">
                      Restaurants
                    </div>
                  </div>

                </div>

                {/* Best Time */}

                <div className="mt-5">

                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      place.statusColor === "green"
                        ? "bg-green-500/20 text-green-400"
                        : place.statusColor === "yellow"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    🟢 {place.bestTime}
                  </span>

                </div>

                {/* Button */}

                <button
                  onClick={() => navigate(`/destination/${encodeURIComponent(place.name)}`)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
                >
                  Explore {place.name}
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default AITopPicks;