import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DispatchFeedbackContexts,
  DispatchUserContexts,
  ShowUserContexts,
} from "../App";
import { DispatchCartContexts, ShowCartContexts } from "./../App";
import apiService from "../services/apiService";
function Header() {
  const UserContext = ShowUserContexts();
  const dispatchUserContexts = DispatchUserContexts();
  const cartDispatch = DispatchCartContexts();
  const setSelectedCompany = (company) => {
    console.log(company);
    apiService.setCompany(company);
    dispatchUserContexts({
      data: UserContext.data,
      authenticated: UserContext.authenticated,
      companies: UserContext.companies,
      selectedCompany: company,
    });
    cartDispatch({
      cart: apiService.getCompanyCart(),
    });
  };
  useEffect(() => {
    dispatchUserContexts({
      data: UserContext.data,
      authenticated: UserContext.authenticated,
      companies: UserContext.companies,
      selectedCompany: apiService.getCompany()
        ? apiService.getCompany().id
        : "NO company",
    });
  }, []);

  useEffect(() => {}, []);
  return (
    <nav class="navbar navbar-expand-lg justify-content-around navbar-light bg-light">
      <div>
        <a class="navbar-brand" href="#">
          Navbar
          {apiService.getCompany().id}
        </a>
      </div>
      <p>Hello {UserContext.data.name}</p>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse flex-grow-0" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <Link class="nav-link" to="/">
              Home{" "}
            </Link>
          </li>

          {UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/account">
                Account{" "}
              </Link>
            </li>
          )}
          {UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/inventory">
                Inventory{" "}
              </Link>
            </li>
          )}
          {UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/vendors">
                Vendors{" "}
              </Link>
            </li>
          )}
          {UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/customers">
                Customers{" "}
              </Link>
            </li>
          )}

          {UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/ap-workflow">
                AP Workflow{" "}
              </Link>
            </li>
          )}
          {UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/salesOrders">
                Sales Orders{" "}
              </Link>
            </li>
          )}
          {!UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/signup">
                Sign Up{" "}
              </Link>
            </li>
          )}
          {!UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/signin">
                Sign In{" "}
              </Link>
            </li>
          )}
          {UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/signout">
                Sign Out{" "}
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div>
        <select
          class="form-select  mb-3"
          onChange={(event) => setSelectedCompany(event.target.value)}
          aria-label=". example"
        >
          {apiService.getUser() &&
            apiService.getUser().companies.map((company) => {
              return (
                <option
                  selected={
                    apiService.getCompany()
                      ? apiService.getCompany().id === company.id
                      : false
                  }
                  value={company.id}
                >
                  {company.name}
                </option>
              );
            })}
        </select>
      </div>
    </nav>
  );
}

export default Header;
