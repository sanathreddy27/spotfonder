function AITripSummary({ state }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 mb-8 shadow-xl">

      <h2 className="text-3xl font-bold mb-6">
        🤖 AI Travel Summary
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <h3 className="font-bold text-xl mb-2">
            🌍 Destination
          </h3>

          <p>{state.destination}</p>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">
            💰 Budget
          </h3>

          <p>₹ {state.budget}</p>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">
            👥 Travelers
          </h3>

          <p>{state.travelers}</p>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">
            🌴 Trip Type
          </h3>

          <p>{state.tripType}</p>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">
            🚆 Preferred Transport
          </h3>

          <p>{state.transport}</p>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">
            📅 Travel Dates
          </h3>

          <p>
            {state.travelDate} - {state.returnDate}
          </p>
        </div>

      </div>
    </div>
  );
}

export default AITripSummary;