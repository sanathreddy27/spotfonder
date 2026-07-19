function BudgetCard() {
  return (
    <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">💰 Budget Planner</h2>

      <div className="bg-slate-700 rounded-xl p-6 space-y-2">
        <p>🚆 Transport : ₹ --</p>
        <p>🏨 Hotel : ₹ --</p>
        <p>🍽️ Food : ₹ --</p>
        <p>🚕 Local Travel : ₹ --</p>
        <p>🎟️ Attractions : ₹ --</p>

        <hr className="my-3" />

        <h3 className="text-xl font-bold">
          Total Budget : ₹ --
        </h3>
      </div>
    </div>
  );
}

export default BudgetCard;