import { React, useEffect, useState } from "react";
import "./../../style/menu.css";
import MenuItem from "./menuItem";
function MenuCategory({ category, items, orderItems, setOrderItems }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="menu-category">
      <h3
        href="#"
        className="text-start"
        onClick={() => setExpanded(!expanded)}
      >
        {category}
      </h3>

      <div className={`menu-items ${expanded ? "visible" : "hidden"}`}>
        {items.map((menuItem) => (
          <MenuItem
            item={menuItem}
            orderItems={orderItems}
            setOrderItems={setOrderItems}
          />
        ))}
      </div>
    </div>
  );
}

export default MenuCategory;
