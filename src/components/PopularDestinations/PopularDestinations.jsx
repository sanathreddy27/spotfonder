function PopularDestinations() {
  return (
    <section className="bg-slate-950 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          🌍 Popular Destinations
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold">🇫🇷 Paris</h3>
            <p className="mt-3 text-gray-300">
              Discover the Eiffel Tower and charming streets.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold">🇯🇵 Tokyo</h3>
            <p className="mt-3 text-gray-300">
              Experience futuristic cities and rich culture.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold">🇨🇭 Switzerland</h3>
            <p className="mt-3 text-gray-300">
              Explore breathtaking mountains and peaceful lakes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularDestinations;