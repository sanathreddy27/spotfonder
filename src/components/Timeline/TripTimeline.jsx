import { motion } from "framer-motion";

function TripTimeline({ days }) {
  console.log(days);

  return (
    <div className="relative">

      {/* Timeline Line */}
      <div className="absolute left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-400 to-green-500 rounded-full"></div>

      {days.map((day, index) => (

        <motion.div
          key={day.day}
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.2,
          }}
          viewport={{ once: true }}
          className="relative pl-20 pb-14"
        >

          {/* Circle */}
          <div className="absolute left-3 w-8 h-8 rounded-full bg-blue-600 border-4 border-slate-900 shadow-lg"></div>

          {/* Main Card */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-[1.02] transition duration-500">

            {/* Progress Bar & Day Indicator */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-cyan-400 font-bold text-lg">
                Day {day.day} of {days.length}
              </span>
              <span className="text-gray-400">
                {Math.round((day.day / days.length) * 100)}%
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 mb-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${(day.day / days.length) * 100}%`,
                }}
              ></div>
            </div>

            <h2 className="text-3xl font-bold text-blue-400">
              🗓 Day {day.day}
            </h2>

            {/* Daily Theme Subtitle */}
            <p className="text-cyan-400 mt-2 text-lg font-semibold mb-6">
              🎯 {day.theme}
            </p>

            {/* Weather Advice Section */}
            <div className="mt-3 bg-blue-500/10 border border-blue-400 rounded-xl p-3">
              <p className="text-blue-300">
                🌤 {day.weatherAdvice}
              </p>
            </div>

            <div className="space-y-6 mt-6">

              {/* Hotel Check-in */}
              <div className="bg-blue-500/20 rounded-2xl p-5">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">
                  🏨 Hotel Check-in
                </h3>
                {day.hotel && (
                  <div className="bg-slate-700 rounded-2xl overflow-hidden">
                    <img
                      src={day.hotel.image}
                      alt={day.hotel.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-5">
                      <h4 className="text-2xl font-bold">
                        {day.hotel.name}
                      </h4>
                      <p className="text-gray-400 mt-2">
                        📍 {day.hotel.address}
                      </p>
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${day.hotel.latitude},${day.hotel.longitude}`,
                            "_blank"
                          )
                        }
                        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition"
                      >
                        🗺 Open in Google Maps
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Breakfast */}
              <div className="bg-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                  🍳 Breakfast
                </h3>
                <div className="bg-slate-700 rounded-xl p-4">
                  <h4 className="text-xl font-bold">
                    {day.breakfast?.name}
                  </h4>
                  <p className="text-gray-400 mt-2">
                    {day.breakfast?.address}
                  </p>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="mt-4 bg-slate-700 rounded-xl p-3">
                <h4 className="font-bold text-cyan-400">
                  ⏰ Today's Schedule
                </h4>
                <ul className="mt-3 space-y-2">
                  {day.schedule?.map((item, index) => (
                    <li key={index}>
                      🕒 {item.time} — {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Morning Tour */}
              <div className="bg-green-500/20 rounded-2xl p-5">
                <h3 className="text-2xl font-bold text-green-300 mb-5">
                  📍 Morning Tour
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {day.morning?.map((place) => (
                    <div
                      key={place.id || place.name}
                      className="bg-slate-700 rounded-2xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={place.image || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"}
                        alt={place.name}
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-xl font-bold">
                          {place.name}
                        </h4>
                        <p className="text-gray-400 mt-2">
                          📍 {place.address || "Address unavailable"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lunch */}
              <div className="bg-orange-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-2xl font-bold text-orange-300 mb-4">
                  🍛 Lunch
                </h3>
                {day.lunch && (
                  <div className="bg-slate-700 rounded-2xl overflow-hidden">
                    <img
                      src={day.lunch.image}
                      alt={day.lunch.name}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-5">
                      <h4 className="text-2xl font-bold">
                        {day.lunch.name}
                      </h4>
                      <p className="text-gray-400 mt-2">
                        📍 {day.lunch.address}
                      </p>
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${day.lunch.latitude},${day.lunch.longitude}`,
                            "_blank"
                          )
                        }
                        className="mt-4 w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-xl font-bold transition"
                      >
                        🗺 Open in Google Maps
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Afternoon Tour */}
              <div className="bg-green-600/20 rounded-2xl p-5 mt-6">
                <h3 className="text-2xl font-bold text-green-300 mb-5">
                  🌄 Afternoon Tour
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {day.afternoon?.map((place) => (
                    <div
                      key={place.id || place.name}
                      className="bg-slate-700 rounded-2xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={place.image || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"}
                        alt={place.name}
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-xl font-bold text-green-300">
                          {place.name}
                        </h4>
                        <p className="text-gray-400 mt-2">
                          📍 {place.address || "Address unavailable"}
                        </p>
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
                              "_blank"
                            )
                          }
                          className="w-full mt-4 bg-green-600 hover:bg-green-700 py-2 rounded-xl font-bold transition"
                        >
                          🗺 View on Map
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evening Experience */}
              <div className="bg-purple-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-2xl font-bold text-purple-300 mb-5">
                  ☕ Evening Experience
                </h3>
                {day.evening?.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-5">
                    {day.evening.map((place) => (
                      <div
                        key={place.id || place.name}
                        className="bg-slate-700 rounded-2xl overflow-hidden shadow-lg"
                      >
                        <img
                          src={place.image || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"}
                          alt={place.name}
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="text-xl font-bold text-purple-300">
                            {place.name}
                          </h4>
                          <p className="text-gray-400 mt-2">
                            📍 {place.address || "Address unavailable"}
                          </p>
                          <button
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
                                "_blank"
                              )
                            }
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 py-2 rounded-xl font-bold transition"
                          >
                            🗺 Open in Google Maps
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Relax at your hotel or explore the local market.
                  </p>
                )}
              </div>

              {/* Dinner */}
              <div className="bg-red-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-2xl font-bold text-red-300 mb-4">
                  🍽 Dinner
                </h3>
                {day.dinner && (
                  <div className="bg-slate-700 rounded-2xl overflow-hidden">
                    <img
                      src={day.dinner.image}
                      alt={day.dinner.name}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-5">
                      <h4 className="text-2xl font-bold">
                        {day.dinner.name}
                      </h4>
                      <p className="text-gray-400 mt-2">
                        📍 {day.dinner.address}
                      </p>
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${day.dinner.latitude},${day.dinner.longitude}`,
                            "_blank"
                          )
                        }
                        className="w-full mt-4 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition"
                      >
                        🗺 Open in Google Maps
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stay Tonight */}
              <div className="bg-blue-900/30 rounded-2xl p-5 mt-6">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">
                  🌙 Stay Tonight
                </h3>
                {day.stay && (
                  <div className="bg-slate-700 rounded-2xl overflow-hidden">
                    <img
                      src={day.stay.image}
                      alt={day.stay.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-5">
                      <h4 className="text-2xl font-bold">
                        {day.stay.name}
                      </h4>
                      <p className="text-gray-400 mt-2">
                        📍 {day.stay.address}
                      </p>
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${day.stay.latitude},${day.stay.longitude}`,
                            "_blank"
                          )
                        }
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition"
                      >
                        🏨 View Hotel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Daily Overview Summary Box */}
            <div className="mt-8 bg-slate-700 rounded-2xl p-4">
              <h3 className="font-bold text-green-400">
                📋 Today's Plan
              </h3>
              <p className="mt-2 text-gray-300">
                Visit {(day.morning?.length || 0) + (day.afternoon?.length || 0) + (day.evening?.length || 0)} attractions, enjoy local cuisine, and stay at{" "}
                <strong>{typeof day.stay === "string" ? day.stay : day.stay?.name || "your hotel"}</strong>.
              </p>
            </div>

          </div>

        </motion.div>

      ))}

      {/* Summary Card */}
      <div className="mt-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-center shadow-xl">
        <h2 className="text-4xl font-bold">
          🎉 Trip Complete
        </h2>
        <p className="mt-4 text-xl">
          You have explored {days.length} wonderful days.
        </p>
        <p className="mt-2 text-white/90">
          Have a safe journey! ✈️
        </p>
      </div>

    </div>
  );
}

export default TripTimeline;