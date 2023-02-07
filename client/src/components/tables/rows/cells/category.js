// client/src/App.js

import React, { useEffect } from "react";
import { useState } from "react";
import apiService from "../../../../services/apiService";

function CategoryCell(props) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(
    props.category ? props.category : ""
  );
  const [newCategory, setNewCategory] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setCategories(props.categories);
  }, [props.categories]);

  const handleChange = (event) => {
    console.log(event.target.value);
    setNewCategory(event.target.value);
    props.setCategory(event.target.value);
  };
  const addNewCategory = async () => {
    try {
      let res = await apiService.addNewCategory(newCategory);
      setCategories(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {}, [categories]);
  return (
    <div className={props.className}>
      <label htmlFor="">Category</label>
      <div className="tag-input">
        <div className="tag-slider">
          <small className="pill-option pill-selected pill-multiple">
            {selected ? selected : "Select a category"}
          </small>
        </div>
        <div className="open-pills-menu">
          <svg
            className="open-pills-menu"
            onClick={() => (props.disabled ? null : setOpen(!open))}
            width="18px"
            clip-rule="evenodd"
            fill-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m11.998 2c5.517 0 9.997 4.48 9.997 9.998 0 5.517-4.48 9.997-9.997 9.997-5.518 0-9.998-4.48-9.998-9.997 0-5.518 4.48-9.998 9.998-9.998zm4.843 8.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291z"
              fill-rule="nonzero"
            />
          </svg>
        </div>
      </div>
      {open && (
        <div className="pills-menu">
          {categories &&
            categories.map((category) => {
              return (
                <a
                  onClick={() => (
                    setSelected(category),
                    setOpen(false),
                    props.setCategory(category)
                  )}
                  className="pill-option"
                >
                  {category}
                </a>
              );
            })}
          <div className="pill-input">
            <input
              type="text"
              onChange={handleChange}
              placeholder="New cat"
              name="newCategory"
              value={newCategory}
            />
            <a href="#" onClick={() => addNewCategory()}>
              Add
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryCell;
