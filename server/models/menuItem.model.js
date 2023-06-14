module.exports = (sequelize, Sequelize) => {
  const MenuItem = sequelize.define(
    "menuItem",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      price: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: false,
      },
    },
    {}
  );

  MenuItem.getMenuItems = async function () {
    const { ingredient, inventory, category } = require("./../models");
    var menuItems = await MenuItem.findAll({
      include: [{ model: ingredient, include: inventory }, category],
    });

    // Group the menu items by category
    const groupedMenuItems = menuItems.reduce((acc, menuItem) => {
      const { category } = menuItem;
      if (!acc[category.name]) {
        acc[category.name] = [];
      }
      acc[category.name].push(menuItem);
      return acc;
    }, {});

    // Sort the categories based on the 'sortOrder' property
    var sortedCategories = Object.keys(groupedMenuItems).sort((a, b) => {
      return (
        groupedMenuItems[a][0].category.sortOrder -
        groupedMenuItems[b][0].category.sortOrder
      );
    });
    var newItems = {};
    // Sort the menu items within each category
    sortedCategories.forEach((categoryName) => {
      newItems[categoryName] = groupedMenuItems[categoryName].sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    });

    return newItems;
  };

  MenuItem.prototype.checkIfAvailable = async function (quantity) {
    const { inventory } = require("./../models");
    const ingredients = await this.getIngredients({ include: inventory });

    for (const ingredient of ingredients) {
      var quantityNeeded = ingredient.quantityNeeded * quantity;
      if (quantityNeeded > ingredient.inventory.quantity) {
        return false;
      }
    }
    return true;
  };

  return MenuItem;
};
