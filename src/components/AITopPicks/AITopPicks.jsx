import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAIRecommendations } from "../../api/ai";

function AITopPicks() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await getAIRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold">
            Discover India's Best Destinations
          </h2>

          <p className="mt-6 text-xl text-gray-400">
            Loading destinations...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 py-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            🌍 Explore Beautiful Places
          </h2>

          <p className="text-gray-400 text-xl mt-4">
            Choose your next destination
          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

          {recommendations.map((place, index) => (

            <div
              key={index}
              className="bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300"
            >

              <img
                src={place.image}
                alt={place.name}
                className="w-full h-72 object-cover"
              />

              <div className="p-8">

                <h2 className="text-4xl font-bold text-blue-400">
                  {place.name}
                </h2>

                <p className="text-gray-400 text-xl mt-3">
                  📍 {place.state}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/destination/${encodeURIComponent(place.name)}`
                    )
                  }
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-xl text-xl font-bold hover:scale-105 transition"
                >
                  View More Details →
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