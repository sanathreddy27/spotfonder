function Trending() {
  const destinations = [
    {
      name: "Goa",
      image:
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86",
      category: "Beach Paradise",
    },
    {
      name: "Kashmir",
      image:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d",
      category: "Snow Mountains",
    },
    {
      name: "Jaipur",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245",
      category: "Heritage",
    },
    {
      name: "Ooty",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      category: "Hill Station",
    },
    {
      name: "Ladakh",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      category: "Adventure",
    },
    {
      name: "Andaman",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      category: "Island",
    },
  ];

  return (
    <section className="bg-slate-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold text-white">
            🔥 Trending Destinations
          </h1>

          <p className="text-gray-400 mt-4 text-xl">
            Explore the destinations everyone is talking about.
          </p>

        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">

          {destinations.map((place, index) => (

            <div
              key={index}
              className="bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition duration-300"
            >

              <img
                src={place.image}
                alt={place.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">

                <h2 className="text-3xl font-bold text-white">
                  {place.name}
                </h2>

                <p className="text-blue-400 mt-2">
                  {place.category}
                </p>

                <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold">
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

export default Trending;