import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Fix Leaflet default icon paths broken by bundlers */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const properNames = {
  himachalpradesh: "Himachal Pradesh",
  tamilnadu: "Tamil Nadu",
  westbengal: "West Bengal",
  madhyapradesh: "Madhya Pradesh",
  andhrapradesh: "Andhra Pradesh",
  uttarpradesh: "Uttar Pradesh",
  alleppey: "Alappuzha",
  pondicherry: "Puducherry",
};

const MapComponent = ({ address }) => {
  const city = properNames[address.city] || address.city;
  const state = properNames[address.state] || address.state;
  const place = `${address.area ? address.area + ", " : ""}${city}, ${state}`;

  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const searchTexts = [
      `${address.area}, ${city}, ${state}, India`,
      `${address.area}, ${city}, India`,
      `${city}, ${state}, India`,
    ].filter(Boolean);

    const fetchCoordinates = async () => {
      try {
        for (const text of searchTexts) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(text)}`
          );
          const data = await response.json();

          if (!isMounted) return;

          if (data.length > 0) {
            setCoordinates([Number(data[0].lat), Number(data[0].lon)]);
            setLoading(false);
            return;
          }
        }

        if (isMounted) {
          setCoordinates([]);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching geocoding data:", err);
          setError("Map is not available right now");
          setLoading(false);
        }
      }
    };

    fetchCoordinates();
    return () => {
      isMounted = false;
    };
  }, [address.area, city, state]);

  if (loading) {
    return (
      <div className="pd-map-placeholder pd-map-loading" aria-label="Loading map">
        <span className="pd-map-placeholder-text">Loading map…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-map-placeholder pd-map-error" role="alert">
        <span className="pd-map-placeholder-text">{error}</span>
      </div>
    );
  }

  if (coordinates.length === 0) {
    return (
      <div className="pd-map-placeholder" aria-label="Map unavailable">
        <span className="pd-map-placeholder-text">
          Map not available for this location
        </span>
      </div>
    );
  }

  return (
    <div
      className="pd-map-wrap"
      /**
       * Touch scroll trap prevention:
       * The MapContainer itself captures touch events.
       * We use `scrollWheelZoom={false}` and add touch-action
       * via CSS .pd-map-wrap to let the page scroll on mobile.
       */
    >
      <MapContainer
        key={coordinates.join(",")}
        center={coordinates}
        zoom={14}
        scrollWheelZoom={false}
        className="pd-leaflet-map"
        aria-label={`Map showing location: ${place}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>{place}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
