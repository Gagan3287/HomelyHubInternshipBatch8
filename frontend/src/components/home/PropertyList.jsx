import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";
import PropertyCard from "./PropertyCard";
import Skeleton from "../ui/Skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import "../../css/Home.css";

const PropertyList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const { properties, totalProperties, loading, error, searchParams } = useSelector(
    (state) => state.properties
  );

  const lastPage = Math.max(1, Math.ceil((totalProperties || 0) / 12));

  useEffect(() => {
    dispatch(propertyAction.updateSearchParams({ page: currentPage }));
    dispatch(getAllProperties());
  }, [currentPage, dispatch]);

  const handleClearFilters = () => {
    setCurrentPage(1);
    dispatch(propertyAction.updateSearchParams({}));
    // Reset to empty params and reload
    dispatch(getAllProperties());
  };

  const handleRetry = () => {
    dispatch(getAllProperties());
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  // Active filter summary text
  const hasActiveFilters =
    searchParams &&
    Object.keys(searchParams).some(
      (key) => key !== "page" && Boolean(searchParams[key])
    );

  return (
    <section className="hh-property-section" aria-label="Available Accommodations">
      <div className="hh-section-header">
        <div className="hh-section-title-wrapper">
          <h2 className="hh-section-title">
            <span>Discover Unique Stays</span>
            {totalProperties > 0 && (
              <span className="hh-property-count-badge">
                {totalProperties} {totalProperties === 1 ? "stay" : "stays"}
              </span>
            )}
          </h2>
          <p className="hh-section-subtitle">
            Browse and book accommodations across India
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="hh-clear-filters-link"
            onClick={handleClearFilters}
          >
            <RotateCcw size={15} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Loading Skeleton Grid */}
      {loading && (
        <div className="hh-property-grid" aria-label="Loading properties">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="hh-card-skeleton">
              <Skeleton variant="image" height="210px" className="hh-skel-img" />
              <div className="hh-skel-body">
                <Skeleton variant="heading" width="70%" />
                <Skeleton variant="text" width="45%" />
                <Skeleton variant="text" width="90%" />
                <div className="hh-skel-footer">
                  <Skeleton variant="text" width="35%" />
                  <Skeleton variant="text" width="25%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="hh-state-card hh-error-state" role="alert">
          <AlertCircle size={44} className="hh-state-icon text-danger" />
          <h3 className="hh-state-title">Unable to Load Stays</h3>
          <p className="hh-state-desc">
            {typeof error === "string" ? error : "An unexpected error occurred while fetching properties."}
          </p>
          <button type="button" className="btn-hh btn-primary" onClick={handleRetry}>
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!properties || properties.length === 0) && (
        <div className="hh-state-card hh-empty-state">
          <Inbox size={48} className="hh-state-icon" />
          <h3 className="hh-state-title">No Stays Found</h3>
          <p className="hh-state-desc">
            We couldn't find any accommodations matching your current filter criteria. Try adjusting your destination, dates, or price range.
          </p>
          <button type="button" className="btn-hh btn-secondary" onClick={handleClearFilters}>
            <RotateCcw size={16} />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}

      {/* Property Cards Grid */}
      {!loading && !error && properties && properties.length > 0 && (
        <>
          <div className="hh-property-grid">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination Controls */}
          <nav className="hh-pagination-container" aria-label="Pagination Navigation">
            <button
              type="button"
              className="hh-pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            <span className="hh-pagination-info">
              Page <strong>{currentPage}</strong> of <strong>{lastPage}</strong>
            </span>

            <button
              type="button"
              className="hh-pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= lastPage || properties.length < 12}
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </nav>
        </>
      )}
    </section>
  );
};

export default PropertyList;
