import React, { useEffect, useState } from "react";
import Product from "./product";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
import Filters from "../partials/filters";
import Paginate from "../partials/paginate";
function Shop(props) {
  const [products, setProducts] = useState([]);
  const [productsCopy, setProductsCopy] = useState([]);
  const dispatch = dispatchFeedbackContexts();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentProducts = products.slice(indexOfFirstPost, indexOfLastPost);
  const [filters, setFilters] = useState({
    name: null,
    category: null,
    tag: null,
  });

  useEffect(() => {}, [currentProducts]);
  const paginate = (event, pageNumber) => {
    window.scrollTo(0, 0);
    setCurrentPage(pageNumber);
  };

  const getProducts = async () => {
    try {
      let res = await apiService.getShopItems();

      setProducts(res.data);
      setProductsCopy(res.data);
      if (res.data) {
        getAvailableDimensionsOnly(res.data);
      }
    } catch (err) {
      dispatch({
        value: true,
        message: err.message ? err.message : "Error retrieving products",
        type: "Error",
      });
    }
  };

  const getAvailableDimensionsOnly = (prods) => {
    let categories = [];
    let tags = [];

    prods.forEach((product) => {
      if (
        categories.findIndex(
          (x) => x.toUpperCase() === product.category.name.toUpperCase()
        ) === -1
      ) {
        categories.push(product.category.name);
      }

      product.tags.forEach((tag) => {
        if (tags.findIndex((x) => x.toUpperCase() === tag.name) === -1) {
          tags.push(tag.name);
        }
      });
    });

    setCategories(categories);
    setTags(tags);
  };

  const resetProducts = () => {
    setFilters({
      name: null,
      category: null,
      tag: null,
    });
    setProducts(productsCopy);
  };

  useEffect(() => {
    getProducts();
  }, [currentPage]);
  useEffect(() => {
    // Filter products based on object 'filters' {name,tag,category}
    if (!filters.name && !filters.category && !filters.tag) {
      setProducts(productsCopy);
      return;
    }

    let filteredProducts = [];
    filteredProducts = productsCopy.filter(
      (product) =>
        (filters.name
          ? product.name.toUpperCase().includes(filters.name.toUpperCase())
          : true) &&
        (filters.category
          ? product.category.name.toUpperCase() ===
            filters.category.toUpperCase()
          : true) &&
        (filters.tag
          ? product.tags.some(
              (tag) => tag.name.toUpperCase() === filters.tag.toUpperCase()
            )
          : true)
    );

    setProducts(filteredProducts);
  }, [filters]);

  useEffect(() => {
    console.log("Page rendered");
  }, []);
  return (
    <div className="shop">
      <Filters
        setCurrentPage={setCurrentPage}
        resetProducts={resetProducts}
        categories={categories}
        setFilters={setFilters}
        filters={filters}
        tags={tags}
      />
      <div id="products">
        {currentProducts.map((product) => {
          return (
            <Product
              stocks={product.stocks}
              name={product.name}
              price={product.price}
              productId={product.id}
              product={product}
              category={product.category.name}
              images={product.images}
              tags={product.tags.map((tag) => tag.name)}
            />
          );
        })}
      </div>

      <Paginate
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        totalPosts={products.length}
        paginate={paginate}
      />
    </div>
  );
}

export default Shop;
