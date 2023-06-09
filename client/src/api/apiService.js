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

  //   isAuthenticated = async () => {
  //     var output = false;
  //     return api.get("/api/user/is_authenticated");
  //   };
  signup(form) {
    return api.post("/api/user", form);
  }
}

export default new ApiService();
