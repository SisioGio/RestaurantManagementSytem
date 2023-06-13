import { React, useEffect, useState } from "react";
import apiService from "../../api/apiService";
import MenuCategory from "./menuCategory";
import { Link } from "react-router-dom";

function MenuSelection({ onBack, OnSubmit, orderItems, setOrderItems }) {
  const [menuItems, setMenuItems] = useState({});
  // const [orderItems, setOrderItems] = useState([]);

  const getMenuItems = async () => {
    try {
      var res = await apiService.getMenu();
      setMenuItems(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // const saveMenuItems = () => {
  //   apiService.addMenuItemsToReservation(orderItems);
  // };
  useEffect(() => {
    getMenuItems();
  }, []);
  return (
    <div className="menu-container text-center d-flex flex-column gap-2  p-5">
      <h1>Our Menu</h1>

      <div className="menu">
        {Object.keys(menuItems).map((category) => (
          <MenuCategory
            category={category}
            items={menuItems[category]}
            orderItems={orderItems}
            setOrderItems={setOrderItems}
          />
        ))}
      </div>

      <div className="d-flex justify-content-between">
        <a className="btn btn-danger" onClick={() => onBack()}>
          Back
        </a>

        <a href="#" onClick={() => OnSubmit()} className="btn btn-success">
          Confirm
        </a>
        {/* <Link
          onClick={() => saveMenuItems()}
          to="confirmation"
          role="button"
          className="btn btn-success"
        >
          Proceed
        </Link> */}
      </div>
    </div>
  );
}

export default MenuSelection;
