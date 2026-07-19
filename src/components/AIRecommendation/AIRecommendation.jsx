import { useState } from "react";

function AIRecommendation() {
  const [from, setFrom] = useState("");
  const [budget, setBudget] = useState("");
  const [month, setMonth] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [tripType, setTripType] = useState("");

  return (
    <section className="bg-slate-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold">
            🤖 AI Travel Assistant
          </h1>

          <p className="text-gray-400 mt-4 text-xl">
            Tell us your preferences and we'll suggest the perfect destination.
          </p>

        </div>

        <div className="bg-slate-800 rounded-3xl p-10 shadow-2xl">

          <div className="grid md:grid-cols-2 gap-8">

            {/* From */}
            <div>
              <label className="block mb-3 text-lg">
                📍 From
              </label>

              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Hyderabad"
                className="w-full p-4 rounded-xl bg-slate-700 outline-none"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block mb-3 text-lg">
                💰 Budget
              </label>

              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="20000"
                className="w-full p-4 rounded-xl bg-slate-700 outline-none"
              />
            </div>

            {/* Month */}
            <div>
              <label className="block mb-3 text-lg">
                📅 Travel Month
              </label>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-700"
              >
                <option value="">Select Month</option>

                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>

              </select>
            </div>

            {/* Travelers */}
            <div>
              <label className="block mb-3 text-lg">
                👨 Travelers
              </label>

              <input
                type="number"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-700"
              />
            </div>

          </div>

          {/* Trip Type */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-5">
              ❤️ Choose Trip Type
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {[
                "Beach",
                "Mountains",
                "Adventure",
                "Family",
                "Honeymoon",
                "Solo",
                "Wildlife",
                "Luxury"
              ].map((type) => (

                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`p-4 rounded-xl transition ${
                    tripType === type
                      ? "bg-blue-600"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {type}
                </button>

              ))}

            </div>

          </div>

          <button
            className="w-full mt-12 bg-blue-600 hover:bg-blue-700 py-5 rounded-xl text-2xl font-bold"
          >
            ✨ Get AI Recommendation
          </button>

        </div>

      </div>
    </section>
  );
}

export default AIRecommendation;