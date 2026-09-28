import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";
import { Home, Building2, Building, Hotel, Sparkles, LayoutGrid, DoorOpen } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Stays", icon: LayoutGrid, filterKey: null, filterVal: null },
  { id: "house", label: "House", icon: Home, filterKey: "propertyType", filterVal: "house" },
  { id: "flat", label: "Flat", icon: Building2, filterKey: "propertyType", filterVal: "flat" },
  { id: "guest-house", label: "Guest House", icon: Hotel, filterKey: "propertyType", filterVal: "guest-house" },
  { id: "hotel", label: "Hotel", icon: Building, filterKey: "propertyType", filterVal: "hotel" },
  { id: "entire-home", label: "Entire Home", icon: Sparkles, filterKey: "roomType", filterVal: "Entire Home" },
  { id: "room", label: "Private Room", icon: DoorOpen, filterKey: "roomType", filterVal: "Room" },
];

const CategoryChips = () => {
  const dispatch = useDispatch();
  const searchParams = useSelector((state) => state.properties.searchParams || {});

  const currentPropType = searchParams.propertyType || "";
  const currentRoomType = searchParams.roomType || "";

  const handleSelectCategory = (cat) => {
    let updated = { page: 1 };

    if (!cat.filterKey) {
      // "All Stays" clicked -> reset filters
      updated = { propertyType: "", roomType: "", page: 1 };
    } else if (cat.filterKey === "propertyType") {
      const isSelected = currentPropType.toLowerCase() === cat.filterVal.toLowerCase();
      updated.propertyType = isSelected ? "" : cat.filterVal;
    } else if (cat.filterKey === "roomType") {
      const isSelected = currentRoomType === cat.filterVal;
      updated.roomType = isSelected ? "" : cat.filterVal;
    }

    dispatch(propertyAction.updateSearchParams(updated));
    dispatch(getAllProperties());
  };

  const isCategoryActive = (cat) => {
    if (!cat.filterKey) {
      return !currentPropType && !currentRoomType;
    }
    if (cat.filterKey === "propertyType") {
      return currentPropType.toLowerCase() === cat.filterVal.toLowerCase();
    }
    if (cat.filterKey === "roomType") {
      return currentRoomType === cat.filterVal;
    }
    return false;
  };

  return (
    <div className="category-chips-container" role="region" aria-label="Property Category Filters">
      <div className="category-chips-scroll">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = isCategoryActive(cat);
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-chip ${active ? "active" : ""}`}
              onClick={() => handleSelectCategory(cat)}
              aria-pressed={active}
            >
              <Icon size={18} className="chip-icon" />
              <span className="chip-label">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChips;
