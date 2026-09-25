import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Automatically move map when a place is selected
function MapController({ selectedPlace }) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedPlace?.latitude &&
      selectedPlace?.longitude
    ) {
      map.flyTo(
        [
          selectedPlace.latitude,
          selectedPlace.longitude,
        ],
        14,
        {
          duration: 1.5,
        }
      );
    }
  }, [selectedPlace, map]);

  return null;
}

function DestinationMap({
  destination,
  attractions = [],
  hotels = [],
  restaurants = [],
  selectedPlace,
}) {
  if (!destination) {
    return null;
  }

  const center = [
    destination.latitude,
    destination.longitude,
  ];

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-slate-700">

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Move map to selected place */}

        <MapController
          selectedPlace={selectedPlace}
        />

        {/* Destination */}

        <Marker
          position={[
            destination.latitude,
            destination.longitude,
          ]}
        >
          <Popup>
            <div>
              <strong>
                {destination.name}
              </strong>

              <br />

              📍 Destination
            </div>
          </Popup>
        </Marker>

        {/* Attractions */}

        {attractions.map((place, index) => {

          if (!place.latitude || !place.longitude) {
            return null;
          }

          return (
            <Marker
              key={`attraction-${index}`}
              position={[
                place.latitude,
                place.longitude,
              ]}
            >

              <Popup>

                <div className="min-w-[200px]">

                  <strong>
                    🏞️ {place.name}
                  </strong>

                  <br />

                  <span>
                    {place.address}
                  </span>

                </div>

              </Popup>

            </Marker>
          );
        })}

        {/* Hotels */}

        {hotels.map((place, index) => {

          if (!place.latitude || !place.longitude) {
            return null;
          }

          return (
            <Marker
              key={`hotel-${index}`}
              position={[
                place.latitude,
                place.longitude,
              ]}
            >

              <Popup>

                <div className="min-w-[200px]">

                  <strong>
                    🏨 {place.name}
                  </strong>

                  <br />

                  <span>
                    {place.address}
                  </span>

                </div>

              </Popup>

            </Marker>
          );
        })}

        {/* Restaurants */}

        {restaurants.map((place, index) => {

          if (!place.latitude || !place.longitude) {
            return null;
          }

          return (
            <Marker
              key={`restaurant-${index}`}
              position={[
                place.latitude,
                place.longitude,
              ]}
            >

              <Popup>

                <div className="min-w-[200px]">

                  <strong>
                    🍽️ {place.name}
                  </strong>

                  <br />

                  <span>
                    {place.address}
                  </span>

                </div>

              </Popup>

            </Marker>
          );
        })}

      </MapContainer>

    </div>
  );
}

export default DestinationMap;