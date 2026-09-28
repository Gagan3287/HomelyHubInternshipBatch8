import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/Home.css";

import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";
import { MapPin, Calendar, Users, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import FilterModal from "./FilterModal";

const Search = () => {
  const { RangePicker } = DatePicker;
  const [keyword, setKeyword] = useState({
    city: "",
    guests: "",
    dateIn: "",
    dateOut: "",
  });
  const [value, setValue] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const dispatch = useDispatch();

  function searchHandler(e) {
    if (e) e.preventDefault();
    dispatch(propertyAction.updateSearchParams({ ...keyword, ...selectedFilters, page: 1 }));
    dispatch(getAllProperties());
  }

  function returnDates(date, dateString) {
    if (!date) {
      setValue([]);
      updateKeyword("dateIn", "");
      updateKeyword("dateOut", "");
      return;
    }
    setValue([date[0], date[1]]);
    updateKeyword("dateIn", dateString[0]);
    updateKeyword("dateOut", dateString[1]);
  }

  const updateKeyword = (field, val) => {
    setKeyword((prevKeyword) => ({
      ...prevKeyword,
      [field]: val,
    }));
  };

  const handleFilterChange = (filterName, val) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: val,
    }));
  };

  return (
    <>
      <form className="hh-searchbar-container" onSubmit={searchHandler} role="search">
        {/* Destination Field */}
        <div className="hh-search-field">
          <MapPin size={18} className="hh-search-field-icon" />
          <div className="hh-search-input-wrapper">
            <label htmlFor="search_destination" className="hh-search-label">
              Where
            </label>
            <input
              className="hh-search-input"
              id="search_destination"
              placeholder="Search destinations"
              type="text"
              value={keyword.city}
              onChange={(e) => updateKeyword("city", e.target.value)}
              aria-label="Search destination"
            />
          </div>
        </div>

        <div className="hh-search-divider" />

        {/* Date Range Picker Field */}
        <div className="hh-search-field hh-search-field-date">
          <Calendar size={18} className="hh-search-field-icon" />
          <div className="hh-search-input-wrapper">
            <label className="hh-search-label">When</label>
            <Space direction="vertical" style={{ width: "100%" }}>
              <RangePicker
                value={value}
                format="DD-MM-YYYY"
                picker="date"
                className="date_picker hh-antd-datepicker"
                placeholder={["Check-in", "Check-out"]}
                disabledDate={(current) => current && current.isBefore(Date.now(), "day")}
                onChange={returnDates}
              />
            </Space>
          </div>
        </div>

        <div className="hh-search-divider" />

        {/* Guests Field */}
        <div className="hh-search-field">
          <Users size={18} className="hh-search-field-icon" />
          <div className="hh-search-input-wrapper">
            <label htmlFor="addguest" className="hh-search-label">
              Who
            </label>
            <input
              className="hh-search-input"
              id="addguest"
              placeholder="Add guests"
              type="number"
              min="1"
              max="20"
              value={keyword.guests || ""}
              onChange={(e) => updateKeyword("guests", e.target.value ? +e.target.value : "")}
              aria-label="Add number of guests"
            />
          </div>
        </div>

        {/* Action Buttons: Filter & Search */}
        <div className="hh-search-actions">
          <button
            type="button"
            className="hh-search-filter-btn"
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Open filter modal"
            title="Filters"
          >
            <SlidersHorizontal size={18} />
            <span className="hh-filter-btn-text">Filters</span>
            {Object.keys(selectedFilters).length > 0 && <span className="hh-filter-active-dot" />}
          </button>

          <button type="submit" className="hh-search-submit-btn" aria-label="Search properties">
            <SearchIcon size={18} />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
    </>
  );
};

export default Search;
