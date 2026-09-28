import React from "react";
import "../Css/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages < 2) return null;
  return (
    <div className="pagination">

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          className={currentPage === index + 1 ? "active" : ""}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>

    </div>
  );
};

export default Pagination;
