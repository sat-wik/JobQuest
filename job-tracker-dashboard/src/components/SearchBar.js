import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search by job title or company"
      className="search-bar"
      onChange={(e) => onSearch(e.target.value.toLowerCase())}
    />
  );
};

export default SearchBar;
