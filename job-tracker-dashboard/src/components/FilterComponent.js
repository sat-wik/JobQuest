import React from 'react';

const FilterComponent = ({ onFilterChange }) => {
  return (
    <select onChange={(e) => onFilterChange(e.target.value)} className="filter-component">
      <option value="All">All</option>
      <option value="Applied">Applied</option>
      <option value="Screen">Screen</option>
      <option value="Interviewing">Interviewing</option>
      <option value="Offer">Offer</option>
      <option value="Rejected">Rejected</option>
    </select>
  );
};

export default FilterComponent;
