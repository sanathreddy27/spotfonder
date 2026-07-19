function TransportCards() {
  return (
    <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🚆 Transport Options</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-slate-700 rounded-xl p-5">
          <h3 className="text-xl font-bold">🚆 Train</h3>
          <p>Fare: --</p>
          <p>Duration: --</p>
        </div>

        <div className="bg-slate-700 rounded-xl p-5">
          <h3 className="text-xl font-bold">🚌 Bus</h3>
          <p>Fare: --</p>
          <p>Duration: --</p>
        </div>

        <div className="bg-slate-700 rounded-xl p-5">
          <h3 className="text-xl font-bold">✈️ Flight</h3>
          <p>Fare: --</p>
          <p>Duration: --</p>
        </div>

        <div className="bg-slate-700 rounded-xl p-5">
          <h3 className="text-xl font-bold">🚖 Cab</h3>
          <p>Fare: --</p>
          <p>Duration: --</p>
        </div>

      </div>
    </div>
  );
}

export default TransportCards;