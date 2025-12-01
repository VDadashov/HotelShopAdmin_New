import { createBrowserRouter } from "react-router-dom"
import AdminRoot from "@/pages/AdminRoot"
import { Login } from "../pages/Login"
import PrivateRoute from "@/components/PrivateRoute"
import Profile from "../pages/Profile"
import ProfileSettings from "../pages/Settings/Profile"
import Category from "@/pages/Category"
import Product from "@/pages/Product"
import Contact from "@/pages/Contact"
import Dashboard from "@/pages/Dashboard"
import Page from "@/pages/Pages"
import Section from "@/pages/Section"
import Brand from "@/pages/Brand"
import Testimonial from "@/pages/Testimonial"
import Promo from "@/pages/Promo"
import Upload from "@/pages/Upload"

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
        path: "/brand",
        element:  <Brand />,
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
      {
        path: "/testimonial",
        element: <Testimonial />,
      },
      {
        path: "/promo",
        element: <Promo />,
      },
      {
        path: "/upload",
        element: <Upload />,
      },
      // {
      //     path: "/settings",
      //     element: <Settings />,
      // },
    ],
  },
]);

export default routes