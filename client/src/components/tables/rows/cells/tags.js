// client/src/App.js

import React, { useEffect } from "react";
import { useState } from "react";

import apiService from "../../../../services/apiService";

function TagCell(props) {
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState(
    props.assignedTags ? props.assignedTags : []
  );
  const [newTag, setNewTag] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setTags(props.tags);
  }, [props.tags]);

  const handleChange = (event) => {
    setNewTag(event.target.value);
  };
  const addNewTag = async (tagName) => {
    try {
      let res = await apiService.addNewTag(tagName ? tagName : newTag);
      setTags(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSelection = (event) => {
    var tagName = event.target.text;
    if (selected.indexOf(tagName) > -1) {
      //Remove tag
      let filtered = selected.filter((tag) => tag !== tagName);
      setSelected(filtered);
      console.log(filtered);
      props.setTags(filtered);
    } else {
      // Add tag

      selected.push(tagName);
      let filtered = selected.filter((tag) => true);
      console.log(filtered);
      setSelected(filtered);
      props.setTags(filtered);
    }
  };
  useEffect(() => {
    setSelected(selected);
  }, [tags, selected]);

  return (
    <div className={props.className}>
      <label htmlFor="">Tags</label>
      <div className="tag-input">
        <div className="tag-slider">
          {selected.length > 0 ? (
            selected.map((tag) => {
              return (
                <small className="pill-option pill-selected pill-multiple">
                  {tag}
                </small>
              );
            })
          ) : (
            <small className="pill-option pill-selected pill-multiple">
              Select a tag
            </small>
          )}
        </div>

        <div className="open-pills-menu">
          <svg
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
          {tags &&
            tags.map((tag) => {
              return (
                <a
                  onClick={(event) => handleSelection(event)}
                  className="pill-option"
                >
                  {tag}
                </a>
              );
            })}
          <div className="pill-input">
            <input
              type="text"
              onChange={handleChange}
              placeholder="New tag"
              name="newTag"
              value={newTag}
            />
            <a href="#" onClick={() => addNewTag()}>
              Add
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagCell;
