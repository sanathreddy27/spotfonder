import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getFavorites,
  deleteFavorite,
} from "../api/favorite";

function SavedTrips() {
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function loadFavorites() {
    try {
      const data = await getFavorites();

      setFavorites(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function handleDelete(id) {

    try {

      await deleteFavorite(id);

      loadFavorites();

    } catch (error) {

      console.error(error);

    }

  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-3xl">
        Loading Saved Trips...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-12 text-center">
          ❤️ My Saved Destinations
        </h1>

        {favorites.length === 0 ? (

          <div className="text-center text-2xl text-gray-400">
            No saved destinations yet.
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {favorites.map((place) => (

              <div
                key={place._id}
                className="bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition"
              >

                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">

                  <h2 className="text-3xl font-bold text-blue-400">
                    {place.name}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    📍 {place.state}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-8">

                    <button
                      onClick={() =>
                        navigate(
                          `/destination/${encodeURIComponent(place.name)}`
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold"
                    >
                      🗺 View
                    </button>

                    <button
                      onClick={() => handleDelete(place._id)}
                      className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default SavedTrips;