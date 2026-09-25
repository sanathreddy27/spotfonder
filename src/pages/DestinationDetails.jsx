import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DestinationMap from "../components/DestinationMap/DestinationMap";

function DestinationDetails() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [aiOverview, setAiOverview] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // --------------------------------------------------
  // ATTRACTION STATES
  // --------------------------------------------------

  const [selectedAttraction, setSelectedAttraction] =
    useState(null);

  const [attractionAI, setAttractionAI] =
    useState(null);

  const [attractionLoading, setAttractionLoading] =
    useState(false);

  const [nearbyHotels, setNearbyHotels] =
    useState([]);

  const [nearbyRestaurants, setNearbyRestaurants] =
    useState([]);

  // --------------------------------------------------
  // HOTEL / RESTAURANT SEARCH STATES
  // --------------------------------------------------

  const [hotelSearch, setHotelSearch] =
    useState(null);

  const [restaurantSearch, setRestaurantSearch] =
    useState(null);

  // --------------------------------------------------
  // LOAD DESTINATION
  // --------------------------------------------------

  useEffect(() => {
    async function loadDestination() {
      try {
        console.log("📍 Loading destination:", name);

        const response = await axios.get(
          `http://127.0.0.1:5000/api/destination/${encodeURIComponent(
            name
          )}`
        );

        console.log(
          "📦 Destination response:",
          response.data
        );

        setData(response.data);
      } catch (error) {
        console.error(
          "❌ Destination loading error:",
          error
        );

        setError(
          "Unable to load destination details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (name) {
      loadDestination();
    }
  }, [name]);

  // --------------------------------------------------
  // LOAD AI DESTINATION OVERVIEW
  // --------------------------------------------------

  useEffect(() => {
    async function loadAIOverview() {
      try {
        setAiLoading(true);

        console.log(
          "🤖 Loading destination AI:",
          name
        );

        const response = await axios.get(
          `http://127.0.0.1:5000/api/destination-ai/${encodeURIComponent(
            name
          )}`
        );

        console.log(
          "🤖 Destination AI response:",
          response.data
        );

        setAiOverview(
          response.data.aiOverview
        );
      } catch (error) {
        console.error(
          "❌ Destination AI error:",
          error
        );

        setAiOverview(null);
      } finally {
        setAiLoading(false);
      }
    }

    if (name) {
      loadAIOverview();
    }
  }, [name]);

  // --------------------------------------------------
  // ATTRACTION CLICK
  // --------------------------------------------------

  const handleAttractionClick = async (place) => {
    try {
      setSelectedPlace(place);
      setSelectedAttraction(place);

      setAttractionAI(null);

      // Reset old nearby data
      setNearbyHotels([]);
      setNearbyRestaurants([]);

      // Reset search information
      setHotelSearch(null);
      setRestaurantSearch(null);

      setAttractionLoading(true);

      console.log(
        "🏞️ Selected attraction:",
        place.name
      );

      const response = await axios.get(
        `http://127.0.0.1:5000/api/attraction/${encodeURIComponent(
          name
        )}/${encodeURIComponent(place.name)}`
      );

      console.log(
        "🏞️ Attraction API response:",
        response.data
      );

      if (response.data.success) {
        setSelectedAttraction(
          response.data.attraction
        );

        setAttractionAI(
          response.data.aiOverview
        );

        setNearbyHotels(
          response.data.hotels || []
        );

        setNearbyRestaurants(
          response.data.restaurants || []
        );

        setHotelSearch(
          response.data.hotelSearch || null
        );

        setRestaurantSearch(
          response.data.restaurantSearch || null
        );

        setTimeout(() => {
          document
            .getElementById(
              "selected-attraction"
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }, 100);
      }
    } catch (error) {
      console.error(
        "❌ Attraction loading error:",
        error
      );

      setAttractionAI({
        answer:
          "Unable to load information for this attraction.",
      });
    } finally {
      setAttractionLoading(false);
    }
  };

  // --------------------------------------------------
  // GOOGLE MAPS
  // --------------------------------------------------

  const openMap = (latitude, longitude) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      "_blank"
    );
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="text-6xl mb-6">
            🌍
          </div>

          <h1 className="text-3xl font-bold">
            Exploring {name}...
          </h1>

          <p className="text-gray-400 mt-3">
            Finding attractions, hotels and
            restaurants nearby
          </p>

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-red-400">
            ❌ {error}
          </h1>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Back Home
          </button>

        </div>

      </div>
    );
  }

  if (!data) {
    return null;
  }

  const destination = data.destination;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-6 py-12">

        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => navigate(-1)}
            className="mb-8 text-gray-300 hover:text-white transition"
          >
            ← Back
          </button>

          <p className="text-blue-400 text-lg">
            📍 {destination.coordinates.formatted}
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mt-3">
            {destination.name}
          </h1>

          {/* WEATHER */}

          {destination.weather && (
            <div className="mt-8 inline-flex items-center gap-5 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4">

              <div className="text-4xl">
                🌤️
              </div>

              <div>

                <p className="text-3xl font-bold">
                  {destination.weather.temperature}°C
                </p>

                <p className="text-gray-300">
                  {destination.weather.weather}
                </p>

                <p className="text-gray-400 text-sm">
                  {destination.weather.description}
                </p>

              </div>

              <div className="border-l border-white/20 pl-5">

                <p className="text-gray-400 text-sm">
                  Humidity
                </p>

                <p className="font-semibold">
                  {destination.weather.humidity}%
                </p>

              </div>

              <div className="border-l border-white/20 pl-5">

                <p className="text-gray-400 text-sm">
                  Wind
                </p>

                <p className="font-semibold">
                  {destination.weather.wind} m/s
                </p>

              </div>

            </div>
          )}

          {/* DESTINATION AI */}

          <section className="mt-10">

            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">

              <h2 className="text-3xl font-bold mb-6">
                ⭐ Why {destination.name} is famous
              </h2>

              {aiLoading ? (

                <div className="py-10 text-center">

                  <div className="text-3xl mb-3">
                    🤖
                  </div>

                  <p className="text-slate-400">
                    SpotFonder AI is preparing your
                    travel guide...
                  </p>

                </div>

              ) : aiOverview?.answer ? (

                <div className="text-slate-300 leading-8 whitespace-pre-line">
                  {aiOverview.answer}
                </div>

              ) : (

                <p className="text-slate-400">
                  AI information is currently
                  unavailable.
                </p>

              )}

            </div>

          </section>

        </div>

      </div>

      {/* ================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ================================================== */}
        {/* ATTRACTIONS */}
        {/* ================================================== */}

        <section className="mb-16">

          <div className="mb-8">

            <h2 className="text-4xl font-bold">
              🏞️ Attractions
            </h2>

            <p className="text-gray-400 mt-2">
              Explore places to visit in and around{" "}
              {destination.name}
            </p>

            <p className="text-blue-400 mt-2">
              {data.attractions?.length || 0} places found
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {data.attractions?.map(
              (place, index) => (

                <div
                  key={index}
                  onClick={() =>
                    handleAttractionClick(place)
                  }
                  className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${
                    selectedPlace?.name === place.name
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-900 hover:border-blue-500"
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="bg-blue-500/10 rounded-xl p-3 text-2xl">
                      🏞️
                    </div>

                    <span className="text-xs text-gray-500">
                      #{index + 1}
                    </span>

                  </div>

                  <h3 className="text-xl font-bold mt-5">
                    {place.name}
                  </h3>

                  <p className="text-blue-400 text-sm font-semibold mt-3">
                    🔎 Click to explore this attraction
                  </p>

                  <p className="text-gray-400 text-sm mt-3">
                    📍 {place.address}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      handleAttractionClick(
                        place
                      );
                    }}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
                  >
                    🔎 Explore Attraction
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      openMap(
                        place.latitude,
                        place.longitude
                      );
                    }}
                    className="w-full mt-3 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-semibold transition"
                  >
                    📍 View on Google Maps
                  </button>

                </div>

              )
            )}

          </div>

        </section>

        {/* ================================================== */}
        {/* SELECTED ATTRACTION */}
        {/* ================================================== */}

        {selectedAttraction && (

          <section
            id="selected-attraction"
            className="selected-attraction mb-16 scroll-mt-6"
          >

            {/* TITLE */}

            <div className="mb-8">

              <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
                Selected Attraction
              </p>

              <h2 className="text-4xl font-bold mt-2">
                📍 Selected:{" "}
                {selectedAttraction.name}
              </h2>

            </div>

            {/* ================================================== */}
            {/* PHOTOS */}
            {/* ================================================== */}

            <div className="attraction-photos bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">

              <h3 className="text-2xl font-bold mb-6">
                📸 Photos
              </h3>

              {selectedAttraction.images?.length > 0 ? (

                <div className="attraction-photo-grid grid grid-cols-2 md:grid-cols-3 gap-4">

                  {selectedAttraction.images.map(
                    (image, index) => (

                      <div
                        className="attraction-photo overflow-hidden rounded-2xl"
                        key={`${image}-${index}`}
                      >

                        <img
                          src={image}
                          alt={`${selectedAttraction.name} ${
                            index + 1
                          }`}
                          loading="lazy"
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-400">
                  Photos are not available yet.
                </p>

              )}

            </div>

            {/* ================================================== */}
            {/* INFORMATION */}
            {/* ================================================== */}

            <div className="selected-attraction-info bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mt-6">

              <h3 className="text-2xl font-bold mb-3">
                ⭐ Why it is important
              </h3>

              <p className="text-gray-300 leading-7 mb-8">
                {selectedAttraction.importance ||
                  "Information is not available yet."}
              </p>

              <h3 className="text-2xl font-bold mb-3">
                📜 History
              </h3>

              <p className="text-gray-300 leading-7 mb-8">
                {selectedAttraction.history ||
                  "Historical information is not available yet."}
              </p>

              <h3 className="text-2xl font-bold mb-3">
                ✨ Famous for
              </h3>

              <p className="text-gray-300 leading-7 mb-8">
                {selectedAttraction.famousFor ||
                  "Information is not available yet."}
              </p>

              <h3 className="text-2xl font-bold mb-3">
                📝 Description
              </h3>

              <p className="text-gray-300 leading-7 mb-8">
                {selectedAttraction.description ||
                  "Description is not available yet."}
              </p>

              <h3 className="text-2xl font-bold mb-3">
                💡 Travel tips
              </h3>

              {selectedAttraction.tips?.length > 0 ? (

                <ul className="space-y-3">

                  {selectedAttraction.tips.map(
                    (tip, index) => (

                      <li
                        key={index}
                        className="text-gray-300 bg-slate-950 border border-slate-800 rounded-xl p-4"
                      >
                        💡 {tip}
                      </li>

                    )
                  )}

                </ul>

              ) : (

                <p className="text-gray-400">
                  Travel tips are not available yet.
                </p>

              )}

            </div>

            {/* ================================================== */}
            {/* LOCATION */}
            {/* ================================================== */}

            <div className="attraction-location bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mt-6">

              <h3 className="text-2xl font-bold mb-5">
                📍 Location
              </h3>

              <p className="text-gray-200 mb-3">
                <strong>
                  {selectedAttraction.name}
                </strong>
              </p>

              <p className="text-gray-400 mb-2">
                Latitude:{" "}
                {selectedAttraction.latitude}
              </p>

              <p className="text-gray-400 mb-5">
                Longitude:{" "}
                {selectedAttraction.longitude}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedAttraction.latitude},${selectedAttraction.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
              >
                🗺️ Open in Google Maps
              </a>

            </div>

            {/* ================================================== */}
            {/* AI TRAVEL GUIDE */}
            {/* ================================================== */}

            {attractionAI?.answer && (

              <div className="attraction-ai bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mt-6">

                <h3 className="text-2xl font-bold mb-6">
                  🤖 AI Travel Guide
                </h3>

                <div className="ai-answer bg-slate-950 p-6 rounded-2xl border border-slate-800 text-gray-300">

                  {attractionAI.answer
                    .split("\n")
                    .map((line, index) => {

                      const trimmed =
                        line.trim();

                      if (!trimmed) {
                        return (
                          <br key={index} />
                        );
                      }

                      if (
                        trimmed.startsWith("**") &&
                        trimmed.endsWith("**")
                      ) {
                        return (
                          <h4
                            key={index}
                            className="text-xl font-bold text-white mt-5 mb-3"
                          >
                            {trimmed.replace(
                              /\*\*/g,
                              ""
                            )}
                          </h4>
                        );
                      }

                      if (
                        trimmed.startsWith("• ")
                      ) {
                        return (
                          <li
                            key={index}
                            className="ml-5 mb-2"
                          >
                            {trimmed.substring(
                              2
                            )}
                          </li>
                        );
                      }

                      return (
                        <p
                          key={index}
                          className="leading-8 mb-3"
                        >
                          {trimmed}
                        </p>
                      );
                    })}

                </div>

              </div>

            )}

            {/* ================================================== */}
            {/* HOTELS */}
            {/* ================================================== */}

            <div className="attraction-nearby mt-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">

              <h3 className="text-2xl font-bold mb-5">
                🏨 Hotels near{" "}
                {selectedAttraction.name}
              </h3>

              {hotelSearch?.expanded && (

                <p className="text-yellow-400 mb-5 bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4">
                  ⚠️ No. of nearby hotels was limited
                  within 5 km, so we expanded the
                  search to 15 km.
                </p>

              )}

              {attractionLoading ? (

                <p className="text-gray-400">
                  Finding nearby hotels...
                </p>

              ) : nearbyHotels.length > 0 ? (

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {nearbyHotels.map(
                    (hotel, index) => (

                      <div
                        className="nearby-place-card bg-slate-950 border border-slate-800 rounded-2xl p-5"
                        key={`${hotel.name}-${index}`}
                      >

                        {/* HOTEL IMAGE */}

                        {hotel.image && (
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="nearby-place-image"
                            loading="lazy"
                          />
                        )}

                        <h4 className="font-bold text-lg">
                          {hotel.name}
                        </h4>

                        <p className="text-gray-400 mt-2">
                          {hotel.address}
                        </p>

                        {hotel.distance != null && (

                          <p className="text-gray-500 text-sm mt-2">
                            📏{" "}
                            {(
                              hotel.distance / 1000
                            ).toFixed(1)}{" "}
                            km away
                          </p>

                        )}

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-4 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl font-semibold transition"
                        >
                          🗺️ Google Maps
                        </a>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-400">
                  No nearby hotels found.
                </p>

              )}

            </div>

            {/* ================================================== */}
            {/* RESTAURANTS */}
            {/* ================================================== */}

            <div className="attraction-nearby mt-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">

              <h3 className="text-2xl font-bold mb-5">
                🍽️ Restaurants near{" "}
                {selectedAttraction.name}
              </h3>

              {restaurantSearch?.expanded && (

                <p className="text-yellow-400 mb-5 bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4">
                  ⚠️ No. of nearby restaurants was
                  limited within 5 km, so we expanded
                  the search to 15 km.
                </p>

              )}

              {attractionLoading ? (

                <p className="text-gray-400">
                  Finding nearby restaurants...
                </p>

              ) : nearbyRestaurants.length > 0 ? (

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {nearbyRestaurants.map(
                    (restaurant, index) => (

                      <div
                        className="nearby-place-card bg-slate-950 border border-slate-800 rounded-2xl p-5"
                        key={`${restaurant.name}-${index}`}
                      >

                        {/* RESTAURANT IMAGE */}

                        {restaurant.image && (
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="nearby-place-image"
                            loading="lazy"
                          />
                        )}

                        <h4 className="font-bold text-lg">
                          {restaurant.name}
                        </h4>

                        <p className="text-gray-400 mt-2">
                          {restaurant.address}
                        </p>

                        {restaurant.distance != null && (

                          <p className="text-gray-500 text-sm mt-2">
                            📏{" "}
                            {(
                              restaurant.distance /
                              1000
                            ).toFixed(1)}{" "}
                            km away
                          </p>

                        )}

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-4 bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-xl font-semibold transition"
                        >
                          🗺️ Google Maps
                        </a>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-400">
                  No nearby restaurants found.
                </p>

              )}

            </div>

            {/* ================================================== */}
            {/* SELECTED ATTRACTION MAP */}
            {/* ================================================== */}

            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">

              <h3 className="text-2xl font-bold mb-5">
                🗺️ Location Map
              </h3>

              <DestinationMap
                destination={{
                  name: destination.name,
                  latitude:
                    destination.coordinates.latitude,
                  longitude:
                    destination.coordinates.longitude,
                }}
                attractions={
                  selectedAttraction
                    ? [selectedAttraction]
                    : []
                }
                hotels={nearbyHotels}
                restaurants={nearbyRestaurants}
                selectedPlace={
                  selectedAttraction
                }
              />

            </div>

          </section>

        )}

        {/* ================================================== */}
        {/* DESTINATION HOTELS */}
        {/* ================================================== */}

        <section className="mb-16">

          <div className="mb-8">

            <h2 className="text-4xl font-bold">
              🏨 Nearby Hotels
            </h2>

            <p className="text-gray-400 mt-2">
              Find hotels near{" "}
              {destination.name}
            </p>

            <p className="text-green-400 mt-2">
              {data.hotels?.length || 0} hotels found
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {data.hotels?.map(
              (hotel, index) => (

                <div
                  key={index}
                  onClick={() =>
                    setSelectedPlace(hotel)
                  }
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 hover:-translate-y-1 transition cursor-pointer"
                >

                  <div className="bg-green-500/10 rounded-xl p-3 text-2xl w-fit">
                    🏨
                  </div>

                  <h3 className="text-xl font-bold mt-5">
                    {hotel.name}
                  </h3>

                  <p className="text-gray-400 text-sm mt-3">
                    📍 {hotel.address}
                  </p>

                  {hotel.website && (

                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      className="inline-block mt-4 text-green-400 hover:text-green-300"
                    >
                      🌐 Visit Website
                    </a>

                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      openMap(
                        hotel.latitude,
                        hotel.longitude
                      );
                    }}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold transition"
                  >
                    📍 View on Google Maps
                  </button>

                </div>

              )
            )}

          </div>

        </section>

        {/* ================================================== */}
        {/* DESTINATION RESTAURANTS */}
        {/* ================================================== */}

        <section className="mb-16">

          <div className="mb-8">

            <h2 className="text-4xl font-bold">
              🍽️ Nearby Restaurants
            </h2>

            <p className="text-gray-400 mt-2">
              Find restaurants near{" "}
              {destination.name}
            </p>

            <p className="text-orange-400 mt-2">
              {data.restaurants?.length || 0} restaurants found
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {data.restaurants?.map(
              (restaurant, index) => (

                <div
                  key={index}
                  onClick={() =>
                    setSelectedPlace(
                      restaurant
                    )
                  }
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500 hover:-translate-y-1 transition cursor-pointer"
                >

                  <div className="bg-orange-500/10 rounded-xl p-3 text-2xl w-fit">
                    🍽️
                  </div>

                  <h3 className="text-xl font-bold mt-5">
                    {restaurant.name}
                  </h3>

                  <p className="text-gray-400 text-sm mt-3">
                    📍 {restaurant.address}
                  </p>

                  {restaurant.website && (

                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      className="inline-block mt-4 text-orange-400 hover:text-orange-300"
                    >
                      🌐 Visit Website
                    </a>

                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      openMap(
                        restaurant.latitude,
                        restaurant.longitude
                      );
                    }}
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-700 py-3 rounded-xl font-semibold transition"
                  >
                    📍 View on Google Maps
                  </button>

                </div>

              )
            )}

          </div>

        </section>

        {/* ================================================== */}
        {/* DESTINATION MAP */}
        {/* ================================================== */}

        <section className="mb-16">

          <div className="mb-8">

            <h2 className="text-4xl font-bold">
              🗺️ Explore {destination.name}
            </h2>

            <p className="text-gray-400 mt-2">
              Interactive map showing attractions,
              hotels and restaurants.
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">

            <DestinationMap
              destination={{
                name: destination.name,
                latitude:
                  destination.coordinates.latitude,
                longitude:
                  destination.coordinates.longitude,
              }}
              attractions={
                data.attractions || []
              }
              hotels={data.hotels || []}
              restaurants={
                data.restaurants || []
              }
              selectedPlace={
                selectedAttraction
              }
            />

          </div>

        </section>

      </div>

    </div>
  );
}

export default DestinationDetails;