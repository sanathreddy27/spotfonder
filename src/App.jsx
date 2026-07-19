import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TripResult from "./pages/TripResult";
import DestinationDetails from "./pages/DestinationDetails";
import BudgetPlanner from "./pages/BudgetPlanner";
import SavedTrips from "./pages/SavedTrips";
import Profile from "./pages/Profile";
import RouteMap from "./pages/RouteMap";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/trip-result" element={<TripResult />} />

      {/* Destination Details */}
      <Route
        path="/destination/:name"
        element={<DestinationDetails />}
      />

      <Route path="/budget" element={<BudgetPlanner />} />

      <Route path="/saved-trips" element={<SavedTrips />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/route-map" element={<RouteMap />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;