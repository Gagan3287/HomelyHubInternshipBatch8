import React from "react";
import {
  Wifi,
  ChefHat,
  Car,
  WashingMachine,
  Tv,
  Waves,
  Wind,
} from "lucide-react";

const AMENITIES_LIST = [
  { id: "wifi", value: "Wifi", icon: Wifi },
  { id: "kitchen", value: "Kitchen", icon: ChefHat },
  { id: "parking", value: "Free Parking", icon: Car },
  { id: "washingmachine", value: "Washing Machine", icon: WashingMachine },
  { id: "tv", value: "Tv", icon: Tv },
  { id: "pool", value: "Pool", icon: Waves },
  { id: "ac", value: "Ac", icon: Wind },
];

const AmenitiesField = ({ form }) => {
  const Field = form.Field;
  return (
    <Field name="amenities">
      {(field) => (
        <div className="accf-amenities-grid">
          {AMENITIES_LIST.map((amenity) => {
            const Icon = amenity.icon;
            const isChecked = field.state.value.some(
              (item) => item.name === amenity.value
            );
            return (
              <label
                key={amenity.id}
                className={`accf-amenity-chip ${isChecked ? "accf-amenity-chip--on" : ""}`}
                aria-pressed={isChecked}
              >
                <input
                  type="checkbox"
                  className="accf-amenity-hidden-check"
                  checked={isChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const current = field.state.value || [];
                    if (checked) {
                      field.handleChange([
                        ...current,
                        { name: amenity.value, icon: amenity.id },
                      ]);
                    } else {
                      field.handleChange(
                        current.filter((item) => item.name !== amenity.value)
                      );
                    }
                  }}
                />
                <Icon size={16} />
                <span>{amenity.value}</span>
              </label>
            );
          })}
        </div>
      )}
    </Field>
  );
};

export default AmenitiesField;
