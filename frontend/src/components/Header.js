import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();

  const [userLoggedIn, setUserLoggedIn] = useState();
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkwhichUserLogged();
  }, [navigate]);

  // Logout
  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Check if a user is logged in
  const checkwhichUserLogged = () => {
    if (localStorage.getItem("userInfo")) {
      setUserLoggedIn(true);
      let data = JSON.parse(localStorage.getItem("userInfo"));
      setUser(data);
    } else {
      setUserLoggedIn(false);
    }
  };

  // To  navigate to my Books-Section
  const navigateToMyBooks = (id) => {
    navigate({
      pathname: "/myBooks",
      search: `?id=${id}`,
    });
  };
  return (
    <nav className="bg-dark text-white mb-2 navbar navbar-expand-lg navbar-light">
      <div className="container-md">
        <div className="navbar-brand text-white">
          {" "}
          <span className="badge ">
            {user?.name} {user?.isAdmin ? "(Administrator)" : ""}
          </span>
          {userLoggedIn && !user.isAdmin && (
            <div>
              <div
                role="button"
                onClick={() => navigateToMyBooks(user?._id)}
                className=" link-primary"
              >
                <span className="badge btn-hover text-primary ">My Books</span>
              </div>
            </div>
          )}
        </div>
        {userLoggedIn && (
          <div
            role="button"
            onClick={logout}
            className=" d-flex align-items-center badge btn-hover text-white fs-6  cursor-pointer text-end"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-box-arrow-in-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
              />
              <path
                fillRule="evenodd"
                d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
              />
            </svg>{" "}
            &nbsp;Logout
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
