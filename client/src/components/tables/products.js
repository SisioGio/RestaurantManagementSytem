import React, { useState } from "react";
import ProductRow from "./rows/productRow";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "./../../App";

function Products() {
  const [data, setData] = React.useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const dispatch = dispatchFeedbackContexts();
  const [showForm, setShowForm] = useState(false);

  const getCategories = async () => {
    try {
      let res = await apiService.getCategories();
      console.log(res.data);
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getTags = async () => {
    try {
      let res = await apiService.getTags();
      console.log(res.data);
      setTags(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateValues = async (items) => {
    try {
      if (items) {
        setData(items);
      } else {
        let res = await apiService.getProducts();
        setData(
          res.data.sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt) ? -1 : 1
          )
        );
        console.log(res.data);
      }
    } catch (err) {
      dispatch({
        value: true,
        message: err.message ? err.message : "Error",
        type: "Error",
      });
    }
  };

  React.useEffect(() => {
    getTags();
    getCategories();
    updateValues();
  }, []);

  return (
    <div id="table">
      <div className="admin-product-new-form">
        <a
          className="admin-product-btn-new"
          href="#"
          onClick={(event) => (event.preventDefault(), setShowForm(!showForm))}
        >
          {showForm ? "Close" : "Create"}
        </a>
        {showForm && (
          <ProductRow
            setShowForm={setShowForm}
            new={true}
            tags={tags}
            categories={categories}
            update={updateValues}
            row={{
              id: "",
              name: "",
              description: "",
              price: "",
              file: "",
            }}
          />
        )}
      </div>

      <div className="admin-products">
        {!data ? (
          <p>Waiting to fetch data...</p>
        ) : (
          data.map((row) => {
            return (
              <ProductRow
                new={false}
                tags={tags}
                categories={categories}
                update={updateValues}
                row={row}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Products;
