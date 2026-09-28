import React from "react";

const SearchFilter = ({
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice
}) => {
  return (
    <div className="search-box" role="search">
      <input
        type="text"
        aria-label="Search hotels by title"
        placeholder="Search your Hotel..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="number"
        aria-label="Minimum price"
        min="0"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <input
        type="number"
        aria-label="Maximum price"
        min="0"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

    </div>
  );
};

export default SearchFilter;
