// client/src/App.js

import React, { useEffect, useState } from "react";
function Filters(props) {
  const [tagsVisible, setTagVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);

  return (
    <div id="filter">
      <div className="search">
        <input
          type="text"
          className="link-medium"
          value={props.filters.name}
          onChange={(event) => (
            props.setCurrentPage(1),
            props.setFilters({
              name: event.target.value,
              category: props.filters.category,
              tag: props.filters.tag,
            })
          )}
          placeholder="Search..."
        />
      </div>
      <div className="tags">
        <a
          className="link-medium"
          href="#"
          onClick={() => (
            setTagVisible(false), setCategoryVisible(!categoryVisible)
          )}
        >
          Categories
        </a>

        {categoryVisible && (
          <ul>
            {props.categories.map((category) => {
              return (
                <li>
                  <a
                    className={
                      props.filters.category === category && "filter-selected"
                    }
                    onClick={(event) => (
                      props.setCurrentPage(1),
                      setCategoryVisible(false),
                      props.setFilters({
                        name: props.filters.name,
                        category: category,
                        tag: props.filters.tag,
                      })
                    )}
                    href="#"
                  >
                    {category}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="tags">
        <a
          href="#"
          className="link-medium"
          onClick={() => (
            setCategoryVisible(false), setTagVisible(!tagsVisible)
          )}
        >
          Tags
        </a>
        {tagsVisible && (
          <ul>
            {props.tags.map((tag) => {
              return (
                <li>
                  {" "}
                  <a
                    className={props.filters.tag === tag && "filter-selected"}
                    href="#"
                    onClick={(event) => (
                      props.setCurrentPage(1),
                      setTagVisible(false),
                      props.setFilters({
                        name: props.filters.name,
                        category: props.filters.category,
                        tag: tag,
                      })
                    )}
                  >
                    {tag}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div id="clear">
        <a
          className="link-medium"
          onClick={() => props.resetProducts()}
          href="#"
        >
          Clear
        </a>
      </div>
    </div>
  );
}

export default Filters;
