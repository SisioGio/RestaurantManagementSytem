import api from "./api";
import apiFiles from "./apiService";
class ApiService {
  signin(email, password) {
    return api
      .post("/api/user/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          this.setUser(response.data);
        }
        return response;
      });
  }

  isAuthenticated = async (requestedRole) => {
    var output = false;

    return api.get("/api/user/is_authenticated").then((response) => {
      console.log(response.data);
      if (requestedRole && response.data.indexOf(requestedRole) > -1) {
        return true;
      }
      if (!requestedRole) {
        return true;
      }
    });
  };

  logout() {
    localStorage.removeItem("user");
  }

  removeProductFromCart(stock) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) {
      console.log("Cart does not exists");
      return;
    }
  }

  getCartItems() {
    const cart = localStorage.getItem("cart");

    if (cart) {
      console.log(JSON.parse(cart));
      return JSON.parse(cart);
    } else {
      return {};
    }
  }

  deleteCart() {
    const cart = localStorage.getItem("cart");

    if (cart) {
      localStorage.removeItem("cart");
    }
  }
  removeProductFromCart(stockId) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const cart_items = cart.items;
    console.log(stockId);

    const cart_items_filtered = cart_items.filter(
      (item) => item.stock != stockId
    );
    console.log(cart_items_filtered);

    cart.items = cart_items_filtered;
    cart.totalAmount =
      this.calculateCartTotalAmount(cart_items_filtered).totalAmount;
    cart.numberOfItems =
      this.calculateCartTotalAmount(cart_items_filtered).numberOfItems;

    localStorage.setItem("cart", JSON.stringify(cart));
  }
  calculateCartTotalAmount(cartItems) {
    let numberOfItems = 0;
    let totalAmount = 0;

    for (let item of cartItems) {
      totalAmount =
        totalAmount + parseFloat(item.quantity) * parseFloat(item.productPrice);
      numberOfItems = parseFloat(numberOfItems) + parseFloat(item.quantity);
    }

    return { totalAmount, numberOfItems };
  }

  createCreditCardPayment(form) {
    return api.post("/stripe/create-checkout-session", form);
  }
  updateCartItemQuantity(stockId, quantity) {
    const cart = localStorage.getItem("cart");
    let updatedCart = JSON.parse(cart).items;
    // Check if stock is found
    const itemIndex = updatedCart.findIndex((item) => item.stock === stockId);

    if (itemIndex > -1) {
      let cartItem = updatedCart[itemIndex];
      updatedCart[itemIndex].quantity = quantity;
    } else {
      console.log("Stock not found");
      return;
    }
    localStorage.setItem(
      "cart",
      JSON.stringify({
        items: updatedCart,
        numberOfItems: this.calculateCartTotalAmount(updatedCart).numberOfItems,
        totalAmount: this.calculateCartTotalAmount(updatedCart).totalAmount,
      })
    );
  }

  addProductToCart(stock, product, size, quantity) {
    let cart_item = {
      stock: stock.id,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      image: product.images[0].url,
      sizeId: size.id,
      sizeName: size.name,
      quantity: quantity,
      stripe_price: product.stripe_price,
    };

    const cart = localStorage.getItem("cart");

    if (!cart) {
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: [cart_item],
          numberOfItems: quantity,
          totalAmount: parseFloat(quantity) * parseFloat(product.price),
        })
      );
    } else {
      let updatedCart = JSON.parse(cart).items;

      // Check if item is already in cart

      const itemIndex = updatedCart.findIndex(
        (item) => item.stock === stock.id
      );

      if (itemIndex > -1) {
        updatedCart[itemIndex].quantity =
          parseFloat(updatedCart[itemIndex].quantity) + parseFloat(quantity);
        updatedCart[itemIndex].totalAmount =
          parseFloat(updatedCart[itemIndex].totalAmount) +
          parseFloat(quantity) * parseFloat(product.price);
      } else {
        updatedCart.push(cart_item);
      }

      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: updatedCart,
          numberOfItems:
            this.calculateCartTotalAmount(updatedCart).numberOfItems,
          totalAmount: this.calculateCartTotalAmount(updatedCart).totalAmount,
        })
      );
    }
  }
  register(firstname, surname, email, password) {
    return api.post("/register", {
      firstname,
      surname,
      email,
      password,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user["refreshToken"] : null;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("user"));

    return user ? user["accessToken"] : null;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  getCategories() {
    return api.get("/api/category");
  }
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  isAdmin() {
    let user = JSON.parse(localStorage.getItem("user"));
    try {
      return user.roles.indexOf("ADMIN") > -1;
    } catch {
      return false;
    }
  }
  getUserOrders(userId) {
    return api.get(`/api/user/${userId}/order/`);
  }

  getAdminOrders() {
    return api.get(`/api/order/`);
  }

  async addTicketMessage(form) {
    return await api.post("/api/ticket", form);
  }
  getOrderDetails(orderId) {
    return api.get(`/api/user/${orderId}/order`);
  }

  addProduct(form) {
    return api.post("/api/product", form);
  }

  updateProduct(productId, form) {
    return api.put(`/api/product/${productId}`, form);
  }

  async getProducts() {
    return await api.get("/api/product/");
  }

  deleteProduct(productId) {
    return api.delete(`/api/product/${productId}`);
  }

  getSizes() {
    return api.get("/api/size");
  }
  getTags() {
    return api.get("/api/tag");
  }
  addSize(form) {
    return api.post("/api/size", form);
  }
  deleteSize(sizeId) {
    return api.delete(`/api/size/${sizeId}`);
  }
  updateSize(sizeId, form) {
    return api.put(`/api/size/${sizeId}`, form);
  }

  getStocks() {
    return api.get("/api/stock");
  }

  deleteStock(stockId) {
    return api.delete(`/api/stock/${stockId}`);
  }
  updateStock(stockId, form) {
    return api.put(`/api/stock/${stockId}`, form);
  }

  addStock(form) {
    return api.post("/api/stock", form);
  }
  deleteStock(stockId) {
    return api.delete(`/api/stock/${stockId}`);
  }
  updateStock(stockId, form) {
    return api.put(`/api/stock/${stockId}`, form);
  }

  getUsers() {
    return api.get("/api/user");
  }
  getUserFromDB(id) {
    return api.get("/api/user/" + id);
  }
  updateUser(id, form) {
    return api.put("/api/user/" + id, form);
  }
  getUserCartItems() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return api.get(`/api/cart/user/${user.id}`);
    }
    return new Error("User is not logged in");
  }

  getShopItems() {
    return api.get("/api/stock/catalog");
  }

  deleteCartItem(cartItemId, stockId) {
    return api.delete(`/api/cartitem/${cartItemId}/${stockId}`);
  }

  getPaymentMethods() {
    let user = JSON.parse(localStorage.getItem("user"));
    return api.get(`/api/paymentMethod/user/${user.id}`);
  }

  addPaymentMethod(form) {
    return api.post("/api/paymentMethod", form);
  }
  deletePaymentMethod(paymentMethodId) {
    return api.delete(`/api/paymentMethod/${paymentMethodId}`);
  }
  updatePaymentMethod(paymentMethodId, form) {
    return api.put(`/api/paymentMethod/${paymentMethodId}`, form);
  }

  createOrder(form) {
    return api.post("/api/order", form);
  }

  sendconfirmationemail(email) {
    return api.get("/api/user/sendconfirmationemail/" + email);
  }

  verifyConfirmationCode(code) {
    return api.get("api/user/confirmation/" + code);
  }

  deleteImageFromDb(id) {
    return api.delete("/api/image/" + id);
  }

  getCategories() {
    return api.get("/api/category");
  }

  addNewCategory(name) {
    return api.post("/api/category/" + name);
  }

  getTags() {
    return api.get("/api/tag");
  }

  addNewTag(name) {
    return api.post("/api/tag/" + name);
  }
  getUserAddress(id) {
    return api.get("/api/address/" + id);
  }
  deleteAddress(id) {
    return api.delete("/api/address/" + id);
  }

  updateAddress(form) {
    return api.put("/api/address/", form);
  }
  closeTicket(id) {
    return api.put("/api/ticket/close/" + id);
  }
  getUserTickets(id) {
    return api.get(`/api/user/${id}/tickets`);
  }
  deleteAddress(id) {
    return api.delete("/api/address/" + id);
  }
  addAddress(form) {
    return api.post("/api/address", form);
  }
  createStripeSession() {
    return api.post("/stripe/create-checkout-session");
  }

  confirmOrder(orderId) {
    return api.post("/api/order/confirm/" + orderId);
  }

  async getAllTickets() {
    return await api.get("/api/ticket");
  }
  getProductDetails(productName) {
    return api.get("/api/product/" + productName);
  }

  updatePassword(form) {
    return api.put("/api/user/updatePassword", form);
  }
  resetPassword(email) {
    return api.post("/api/user/resetPassword", { email });
  }
}

export default new ApiService();
