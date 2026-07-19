import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-900 text-white min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Side */}
        <div>

          <p className="text-blue-400 uppercase tracking-widest font-semibold">
            AI Powered Travel Planner
          </p>

          <h1 className="text-6xl font-extrabold mt-5 leading-tight">
            Discover Your
            <span className="text-blue-500"> Perfect Trip </span>
            with AI
          </h1>

          <p className="mt-8 text-gray-300 text-xl leading-8">
            SpotFonder uses Artificial Intelligence, Live Weather,
            Budget Planning and Smart Recommendations to help you
            discover the best places to visit right now.
          </p>

          <div className="flex gap-5 mt-10">

            <button
              onClick={() =>
                document
                  .getElementById("trip-planner")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold"
            >
              🚀 Plan My Trip
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("ai-top-picks")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="border border-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl text-lg"
            >
              🤖 AI Picks
            </button>

          </div>

        </div>

        {/* Right Side */}

        <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl">

          <h2 className="text-3xl font-bold mb-6">
            ✨ Why SpotFonder?
          </h2>

          <div className="space-y-5 text-lg">

            <div>🌦 Live Weather Updates</div>

            <div>🗺 Smart Route Maps</div>

            <div>🤖 AI Travel Recommendations</div>

            <div>🏨 Best Hotels</div>

            <div>🍽 Top Restaurants</div>

            <div>🎯 Tourist Attractions</div>

            <div>💰 Budget Planner</div>

            <div>🚆 Transport Comparison</div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;