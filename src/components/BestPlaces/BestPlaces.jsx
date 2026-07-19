function BestPlaces() {
  const places = [
    {
      image:
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e",
      title: "Today's Best Destination",
      subtitle: "Live AI recommendations will appear here.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      title: "Weather Based Picks",
      subtitle: "Analyzing current weather...",
    },
    {
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      title: "Seasonal Destinations",
      subtitle: "Finding best places for this month...",
    },
  ];

  return (
    <section className="bg-slate-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">

          <h1 className="text-5xl font-bold text-white">
            🌍 Best Places To Visit Right Now
          </h1>

          <p className="text-gray-400 mt-4 text-xl">
            Updated automatically using live weather, season and AI.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {places.map((place, index) => (

            <div
              key={index}
              className="overflow-hidden rounded-3xl bg-slate-800 shadow-xl hover:scale-105 transition duration-300"
            >

              <img
                src={place.image}
                alt={place.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold text-white">
                  {place.title}
                </h2>

                <p className="text-gray-400 mt-3">
                  {place.subtitle}
                </p>

                <button className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-white font-semibold">
                  Explore
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default BestPlaces;