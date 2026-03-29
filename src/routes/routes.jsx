import React from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import PublicHabits from "../components/PublicHabits";
import Login from "../components/Login";
import Register from "../components/Register";
import PrivateRoute from "../components/PrivateRoute";
import AddHabit from "../components/AddHabit";
import MyHabits from "../components/MyHabits";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/public-habits",
        element: <PublicHabits></PublicHabits>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/add-habit",
        element: (
          <PrivateRoute>
            <AddHabit></AddHabit>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-habits",
        element: (
          <PrivateRoute>
            <MyHabits></MyHabits>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
