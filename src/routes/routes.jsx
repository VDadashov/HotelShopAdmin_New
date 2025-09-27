import { createBrowserRouter } from "react-router-dom"
import AdminRoot from "@/pages/AdminRoot"
// import Dashboard from "../pages/Dashboard"
import { Settings } from "../pages/Settings"
import { Login } from "../pages/Login"
import PrivateRoute from "@/components/PrivateRoute"
import Profile from "../pages/Profile"
import ProfileSettings from "../pages/Settings/Profile"
import Company from "../pages/Company";
import Category from "@/pages/Category"
import GalleryCategory from "@/pages/GalleryCategory"
import Product from "@/pages/Product"
import GalleryItem from "@/pages/GalleryItem"
import Contact from "@/pages/Contact"
import Dashboard from "@/pages/Dashboard"
import Page from "@/pages/Pages"
import Section from "@/pages/Section"

// import Contact from "../pages/Contact";

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <AdminRoot />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/company",
        element: <Company />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/gallery-category",
        element: <GalleryCategory />,
      },
      {
        path: "/gallery-item",
        element: <GalleryItem />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/settings/profile",
        element: <ProfileSettings />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/page",
        element: <Page />,
      },
      {
        path: "/section",
        element: <Section />,
      },
      // {
      //     path: "/settings",
      //     element: <Settings />,
      // },
    ],
  },
]);

export default routes