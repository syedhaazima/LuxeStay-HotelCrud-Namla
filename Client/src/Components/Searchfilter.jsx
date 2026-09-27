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
    <div className="search-box">
      <input
        type="text"
        placeholder="Search your Hotel..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <button>Search</button>
    </div>
  );
};

export default SearchFilter;