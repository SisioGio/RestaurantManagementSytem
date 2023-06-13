import api from "./api";
class ApiService {
  /// Local Storage - User
  logout() {
    localStorage.removeItem("user");
  }

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  setCompany(companyId) {
    let companies = this.getUser().companies;
    console.log(companies);
    var company = companies.find((companyObj) => {
      return companyObj.id == companyId;
    });

    localStorage.setItem("company", JSON.stringify(company));
  }
  getCompany() {
    return JSON.parse(localStorage.getItem("company"));
  }
  addCompanyToLocalStorage(company) {
    let user = this.getUser();
    user.companies.push(company);
    this.setUser(user);
  }
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
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
  // Local storage - Reservation
  selectSlot(slot) {
    localStorage.setItem("slot", JSON.stringify(slot));
  }
  getSelectedSlot() {
    let slot = JSON.parse(localStorage.getItem("slot"));
    return slot;
  }

  // Local storage - Save table to reservation
  selectTable(table) {
    var slot = this.getSelectedSlot();
    slot.selectedTable = table;
    this.selectSlot(slot);
  }

  // Local storage - Save menu items to reservation
  addMenuItemsToReservation(items) {
    var slot = this.getSelectedSlot();
    slot.menuItems = items;
    this.selectSlot(slot);
  }

  // Chef - Get order items
  getOrderItems() {
    return api.get("api/order/items");
  }
  // Create order
  createOnsiteOrder(form) {
    return api.post("api/order/onsite", form);
  }

  // Start order
  startOrder(form) {
    return api.put("api/order/onsite/start", form);
  }

  // Delete order item
  deleteOrderItem(form) {
    return api.delete(
      `api/order/item/${form.userId}/${form.orderItemId}`,
      form
    );
  }
  // Update order item quantity
  updateOrderItemQuantity(form) {
    return api.put("api/order/item", form);
  }

  // Mark order item as 'IN PROGRESS'
  markItemAsPreparing(form) {
    return api.put("/api/order/item/preparing", form);
  }
  // Mark order item as 'READY'
  markItemAsReady(form) {
    return api.put("/api/order/item/prepared", form);
  }
  // Mark order item as 'COMPLETED'
  markItemAsServed(form) {
    return api.put("/api/order/item/serve", form);
  }

  // Make reservation

  makeReservation(form) {
    return api.post("api/reservation", form);
  }
  // Delete reservation
  deleteReservation(reservationId) {
    return api.delete(`api/reservation/${reservationId}`);
  }

  // Complete reservation
  completeReservation(form) {
    return api.put(`api/reservation/complete`, form);
  }
  // Confirm reservation
  confirmReservation(form) {
    return api.put("api/reservation/confirm", form);
  }
  // Initialize reservation
  initializeReservation(form) {
    return api.put("api/reservation/initialize", form);
  }
  // Select reservation
  selectReservation(reservation) {
    localStorage.setItem("reservation", JSON.stringify(reservation));
  }
  // Get selected reservation
  getSelectedReservation() {
    return JSON.parse(localStorage.getItem("reservation"));
  }

  // Get all reservations

  getAllReservations() {
    return api.get("api/reservation");
  }

  getReservationByID(reservationId) {
    return api.get(`api/reservation/${reservationId}`);
  }
  // User

  isAuthenticated = async () => {
    return api.get("/api/user/is_authenticated");
  };

  signin(form) {
    return api.post("/api/user/login", form).then((response) => {
      if (response.data.accessToken) {
        this.setUser(response.data);
      }
      return response;
    });
  }

  // User
  signup(form) {
    return api.post("/api/user/login", form).then((response) => {
      if (response.data.accessToken) {
        this.setUser(response.data);
      }
      return response;
    });
  }
  // Customer
  // getReservations
  getUserReservation() {
    return api.get(`/api/customer/reservation/${this.getUser().id}`);
  }
  //   isAuthenticated = async () => {
  //     var output = false;
  //     return api.get("/api/user/is_authenticated");
  //   };
  signup(form) {
    return api.post("/api/user", form);
  }

  // User - Get schedule
  getSchedule(from, to, noOfPeople) {
    if (noOfPeople) {
      return api.get(`/api/slot/availability/${from}/${to}/${noOfPeople}`);
    } else {
      return api.get(`/api/slot/availability/${from}/${to}`);
    }
  }

  // Menu items
  getMenu() {
    return api.get("/api/menu");
  }
}

export default new ApiService();
