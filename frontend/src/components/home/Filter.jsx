import React, { useEffect, useState } from "react";
import FilterModal from "./FilterModal";
import { SlidersHorizontal } from "lucide-react";

import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";

const Filter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(propertyAction.updateSearchParams(selectedFilters));
    dispatch(getAllProperties());
  }, [selectedFilters, dispatch]);

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <>
      <button
        type="button"
        className="filter-trigger-btn"
        onClick={handleShowAllPhotos}
        aria-label="Open filter options"
      >
        <SlidersHorizontal size={18} />
        <span>Filters</span>
      </button>
      {isModalOpen && (
        <FilterModal
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Filter;
