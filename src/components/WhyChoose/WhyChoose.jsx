function WhyChoose() {
  const features = [
    {
      icon: "🤖",
      title: "AI Travel Assistant",
      description:
        "Get smart travel recommendations based on live weather, seasons and AI analysis.",
    },
    {
      icon: "🌦️",
      title: "Live Weather",
      description:
        "View real-time weather before planning your trip.",
    },
    {
      icon: "🗺️",
      title: "Smart Route Planner",
      description:
        "Find the best routes with distance and travel time.",
    },
    {
      icon: "🏨",
      title: "Hotels & Restaurants",
      description:
        "Discover nearby hotels, restaurants and attractions.",
    },
    {
      icon: "💰",
      title: "Budget Planner",
      description:
        "Estimate your complete trip cost before travelling.",
    },
    {
      icon: "❤️",
      title: "Save Trips",
      description:
        "Save your favourite trips and access them anytime.",
    },
  ];

  return (
    <section className="bg-slate-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white">
            ⭐ Why Choose SpotFonder?
          </h1>

          <p className="text-gray-400 mt-4 text-xl">
            Everything you need for a perfect trip in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-3xl p-8 text-center hover:scale-105 transition duration-300 shadow-xl"
            >
              <div className="text-6xl mb-6">
                {feature.icon}
              </div>

              <h2 className="text-2xl font-bold text-white">
                {feature.title}
              </h2>

              <p className="text-gray-400 mt-4">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyChoose;