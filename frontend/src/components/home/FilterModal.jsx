import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../css/FilterModal.css";
import "react-input-range/lib/css/index.css";
import InputRange from "react-input-range";
import {
  X,
  Home,
  Building2,
  Hotel,
  Building,
  Sparkles,
  DoorOpen,
  LayoutGrid,
  Wifi,
  Utensils,
  Wind,
  Shirt,
  Tv,
  Waves,
  Car,
  RotateCcw,
  Check,
} from "lucide-react";

const FilterModal = ({ selectedFilters, onFilterChange, onClose }) => {
  const [priceRange, setPriceRange] = useState({
    min: selectedFilters.minPrice || selectedFilters.priceRange?.min || 600,
    max: selectedFilters.maxPrice || selectedFilters.priceRange?.max || 30000,
  });

  const [propertyType, setPropertyType] = useState(selectedFilters.propertyType || "");
  const [roomType, setRoomType] = useState(selectedFilters.roomType || "");
  const [amenities, setAmenities] = useState(selectedFilters.amenities || []);

  useEffect(() => {
    setPriceRange({
      min: selectedFilters.minPrice || selectedFilters.priceRange?.min || 600,
      max: selectedFilters.maxPrice || selectedFilters.priceRange?.max || 30000,
    });
    setPropertyType(selectedFilters.propertyType || "");
    setRoomType(selectedFilters.roomType || "");
    setAmenities(selectedFilters.amenities || []);
  }, [selectedFilters]);

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const handleMinInputChange = (e) => {
    const minValue = parseInt(e.target.value, 10) || 0;
    setPriceRange((prev) => ({ ...prev, min: minValue }));
  };

  const handleMaxInputChange = (e) => {
    const maxValue = parseInt(e.target.value, 10) || 0;
    setPriceRange((prev) => ({ ...prev, max: maxValue }));
  };

  const handleApplyFilters = () => {
    onFilterChange("minPrice", priceRange.min);
    onFilterChange("maxPrice", priceRange.max);
    onFilterChange("propertyType", propertyType);
    onFilterChange("roomType", roomType);
    onFilterChange("amenities", amenities);
    onClose();
  };

  const propertyTypeOptions = [
    { value: "house", label: "House", icon: Home },
    { value: "flat", label: "Flat", icon: Building2 },
    { value: "guest-house", label: "Guest House", icon: Hotel },
    { value: "hotel", label: "Hotel", icon: Building },
  ];

  const roomTypeOptions = [
    { value: "Entire Home", label: "Entire Home", icon: Sparkles },
    { value: "Room", label: "Room", icon: DoorOpen },
    { value: "", label: "Any Type", icon: LayoutGrid },
  ];

  const amenitiesOptions = [
    { value: "Wifi", label: "Wi-Fi", icon: Wifi },
    { value: "Kitchen", label: "Kitchen", icon: Utensils },
    { value: "Ac", label: "AC", icon: Wind },
    { value: "Washing Machine", label: "Washing Machine", icon: Shirt },
    { value: "Tv", label: "TV", icon: Tv },
    { value: "Pool", label: "Pool", icon: Waves },
    { value: "Free Parking", label: "Free Parking", icon: Car },
  ];

  const handleClearFilters = () => {
    setPriceRange({ min: 600, max: 30000 });
    setPropertyType("");
    setRoomType("");
    setAmenities([]);
  };

  const handleAmenitiesChange = (selectedAmenity) => {
    setAmenities((prev) =>
      prev.includes(selectedAmenity)
        ? prev.filter((item) => item !== selectedAmenity)
        : [...prev, selectedAmenity]
    );
  };

  const handlePropertyTypeChange = (selectedType) => {
    setPropertyType((prev) => (prev === selectedType ? "" : selectedType));
  };

  const handleRoomTypeChange = (selectedType) => {
    setRoomType((prev) => (prev === selectedType ? "" : selectedType));
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content filter-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <h3>Filter Stays</h3>
          <button className="close-button" onClick={onClose} aria-label="Close filters">
            <X size={20} />
          </button>
        </div>

        <div className="modal-filters-container">
          {/* Price Range Section */}
          <div className="filter-section">
            <label className="filter-section-title">Price Range per Night</label>
            <div className="range-slider-wrapper">
              <InputRange
                minValue={600}
                maxValue={30000}
                value={priceRange}
                onChange={handlePriceRangeChange}
              />
            </div>
            <div className="range-inputs">
              <div className="range-input-group">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={handleMinInputChange}
                  aria-label="Minimum price"
                />
              </div>
              <span className="range-separator">-</span>
              <div className="range-input-group">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={handleMaxInputChange}
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>

          {/* Property Type Section */}
          <div className="filter-section">
            <label className="filter-section-title">Property Type</label>
            <div className="icon-box">
              {propertyTypeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = propertyType.toLowerCase() === option.value.toLowerCase();
                return (
                  <button
                    type="button"
                    key={option.value}
                    className={`selectable-box ${isSelected ? "selected" : ""}`}
                    onClick={() => handlePropertyTypeChange(option.value)}
                  >
                    <Icon size={18} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room Type Section */}
          <div className="filter-section">
            <label className="filter-section-title">Room Type</label>
            <div className="icon-box">
              {roomTypeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = roomType === option.value;
                return (
                  <button
                    type="button"
                    key={option.label}
                    className={`selectable-box ${isSelected ? "selected" : ""}`}
                    onClick={() => handleRoomTypeChange(option.value)}
                  >
                    <Icon size={18} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenities Section */}
          <div className="filter-section">
            <label className="filter-section-title">Amenities</label>
            <div className="amenities-checkboxes">
              {amenitiesOptions.map((option) => {
                const Icon = option.icon;
                const isChecked = amenities.includes(option.value);
                return (
                  <label key={option.value} className={`amenity-chip-option ${isChecked ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={isChecked}
                      onChange={() => handleAmenitiesChange(option.value)}
                    />
                    <Icon size={17} />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-buttons">
            <button type="button" className="clear-button" onClick={handleClearFilters}>
              <RotateCcw size={16} />
              <span>Clear All</span>
            </button>
            <button type="button" className="apply-button" onClick={handleApplyFilters}>
              <Check size={16} />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FilterModal.propTypes = {
  selectedFilters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterModal;
