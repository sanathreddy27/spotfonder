import { useEffect, useState } from "react";
import { getAIItinerary } from "../../api/itinerary";

function AIItinerary({ state }) {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItinerary() {
      const result = await getAIItinerary(state);

      if (result?.success) {
        setItinerary(result.itinerary);
      }

      setLoading(false);
    }

    loadItinerary();
  }, [state]);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-3xl p-8 mt-8">
        <h2 className="text-3xl font-bold">
          🤖 Generating AI Itinerary...
        </h2>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="bg-slate-800 rounded-3xl p-8 mt-8">
        <h2 className="text-3xl font-bold">
          No itinerary available.
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-3xl p-8 mt-8">
      <h2 className="text-3xl font-bold mb-8">
        🤖 AI Day-wise Itinerary
      </h2>

      {itinerary.days.map((day) => (
        <div
          key={day.day}
          className="bg-slate-700 rounded-xl p-6 mb-6"
        >
          <h3 className="text-xl font-bold mb-4">
            📅 Day {day.day} - {day.title}
          </h3>

          <ul className="space-y-2">
            {day.activities.map((activity, index) => (
              <li key={index}>✔ {activity}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AIItinerary;