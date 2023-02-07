import React from "react";

const Paginate = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            onClick={(event) => paginate(event, number)}
            className={
              number === currentPage
                ? "page-number page-number-active"
                : "page-number"
            }
          >
            {number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Paginate;
