import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    signOutUser()
      .then(() => {
        setDropdownOpen(false);
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((err) => {
        toast.error("Logout failed: " + err.message);
      });
  };
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm z-50 ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className=" menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              {user && (
                <li>
                  <NavLink to="/my-habits">My Habits</NavLink>
                </li>
              )}
              {user && (
                <li>
                  <NavLink to="/add-habit">Add Habit</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/public-habits">Browse Public Habits</NavLink>
              </li>
            </ul>
          </div>
          <NavLink to="/">
            {" "}
            <img src={logo} className="w-25 rounded" />
          </NavLink>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/my-habits">My Habits</NavLink>
              </li>
            )}
            {user && (
              <li>
                <NavLink to="/add-habit">Add Habit</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/public-habits">Browse Public Habits</NavLink>
            </li>
          </ul>
        </div>

        <div className="navbar-end flex items-center gap-3">
          {user ? (
            <div className="relative">
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {user.displayName || "No Name"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm w-full bg-red-500 text-white hover:bg-red-700"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login">
                <button className="btn bg-green-600 text-white hover:bg-green-700">
                  Log In
                </button>
              </NavLink>

              <NavLink to="/register">
                <button className="btn bg-purple-600 text-white hover:bg-purple-700">
                  Register
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
