import React, { useState } from "react";
import {
  Wifi,
  Tv,
  Wind,
  Utensils,
  Car,
  Waves,
  Dumbbell,
  Coffee,
  Bath,
  Flame,
  Refrigerator,
  Droplets,
  Package,
  Lock,
  Volume2,
  Thermometer,
  PawPrint,
  CircleParking,
  ChefHat,
  WashingMachine,
  Zap,
  Trees,
  Sofa,
  Baby,
  Bike,
  Sunset,
  ShowerHead,
} from "lucide-react";

/* ── Amenity name → Lucide icon mapping ── */
const AMENITY_ICONS = {
  wifi: Wifi,
  "wi-fi": Wifi,
  internet: Wifi,
  broadband: Wifi,
  tv: Tv,
  television: Tv,
  "smart tv": Tv,
  "air conditioning": Wind,
  ac: Wind,
  "air conditioner": Wind,
  kitchen: Utensils,
  "fully equipped kitchen": Utensils,
  kitchenette: Utensils,
  parking: CircleParking,
  "free parking": CircleParking,
  "car park": Car,
  pool: Waves,
  "swimming pool": Waves,
  gym: Dumbbell,
  fitness: Dumbbell,
  "fitness center": Dumbbell,
  coffee: Coffee,
  "coffee maker": Coffee,
  "tea/coffee maker": Coffee,
  bathtub: Bath,
  "hot tub": Bath,
  jacuzzi: Bath,
  fireplace: Flame,
  "fire pit": Flame,
  refrigerator: Refrigerator,
  fridge: Refrigerator,
  microwave: Zap,
  "hot water": Droplets,
  "24-hour hot water": Droplets,
  storage: Package,
  locker: Lock,
  safe: Lock,
  "noise-free": Volume2,
  heater: Thermometer,
  heating: Thermometer,
  "pet friendly": PawPrint,
  pets: PawPrint,
  "pet-friendly": PawPrint,
  chef: ChefHat,
  "private chef": ChefHat,
  "washing machine": WashingMachine,
  laundry: WashingMachine,
  dryer: WashingMachine,
  garden: Trees,
  terrace: Sunset,
  balcony: Sunset,
  "outdoor space": Trees,
  sofa: Sofa,
  "sofa bed": Sofa,
  "baby cot": Baby,
  crib: Baby,
  cycling: Bike,
  bicycle: Bike,
  shower: ShowerHead,
  "hot shower": ShowerHead,
};

const getIcon = (name) => {
  const key = (name || "").toLowerCase().trim();
  const Icon = AMENITY_ICONS[key];
  if (Icon) return <Icon size={18} aria-hidden="true" />;
  /* Generic fallback */
  return <Package size={18} aria-hidden="true" />;
};

/* ── 12-hour time formatter ── */
const to12Hour = (time) => {
  if (!time) return null;
  const str = String(time).trim();
  // Already in 12-hour format?
  if (/am|pm/i.test(str)) return str;
  // Parse HH:MM
  const [hStr, mStr = "00"] = str.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h)) return str;
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${period}`;
};

/* ── Show-more text toggle ── */
const DescriptionBlock = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const CHAR_LIMIT = 400;
  if (!description) return null;

  const isLong = description.length > CHAR_LIMIT;
  const displayed = !isLong || expanded ? description : description.slice(0, CHAR_LIMIT) + "…";

  return (
    <div className="pd-about-block">
      <h2 className="pd-section-heading">About this stay</h2>
      <p className="pd-description">
        {displayed.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
      {isLong && (
        <button
          className="pd-show-more-btn"
          onClick={() => setExpanded((x) => !x)}
          aria-expanded={expanded}
          type="button"
        >
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      )}
    </div>
  );
};

/* ── Main content component ── */
const PropertyContent = ({ description, amenities, checkInTime, checkOutTime }) => {
  const checkIn12 = to12Hour(checkInTime);
  const checkOut12 = to12Hour(checkOutTime);

  return (
    <div className="pd-content-sections">
      {/* About / Description */}
      <DescriptionBlock description={description} />

      {/* Divider */}
      {description && amenities && amenities.length > 0 && (
        <hr className="pd-section-divider" />
      )}

      {/* Amenities */}
      {amenities && amenities.length > 0 && (
        <div className="pd-amenities-block">
          <h2 className="pd-section-heading">What this place offers</h2>
          <ul className="pd-amenities-grid" aria-label="Amenities">
            {amenities.map((amenity, idx) => (
              <li key={idx} className="pd-amenity-item">
                <span className="pd-amenity-icon">{getIcon(amenity.name)}</span>
                <span className="pd-amenity-name">{amenity.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Check-in / Check-out times */}
      {(checkIn12 || checkOut12) && (
        <>
          <hr className="pd-section-divider" />
          <div className="pd-times-block">
            <h2 className="pd-section-heading">Check-in &amp; Check-out</h2>
            <div className="pd-times-grid">
              {checkIn12 && (
                <div className="pd-time-card">
                  <span className="pd-time-label">Check-in</span>
                  <span className="pd-time-value">{checkIn12}</span>
                </div>
              )}
              {checkOut12 && (
                <div className="pd-time-card">
                  <span className="pd-time-label">Check-out</span>
                  <span className="pd-time-value">{checkOut12}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyContent;
