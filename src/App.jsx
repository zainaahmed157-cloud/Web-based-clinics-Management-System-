import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Nav from "./component/nav";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./component/layout";
import Home from "./component/Home";
import Doctors from "./component/Doctors";
import Clinics from "./component/Clinics";
import Appointments from "./component/Appointments";
import About from "./component/About";
import Contact from "./component/Contact";
import Specialties from "./component/Specialties";
import Login from "./component/Login";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/Specialties",
        element: <Specialties />,
      },
      {
        path: "/Doctors",
        element: <Doctors />,
      },
      {
        path: "/Clinics",
        element: <Clinics />,
      },
      {
        path: "/Appointments",
        element: <Appointments />,
      },
      {
        path: "/About",
        element: <About />,
      },
      {
        path: "/Contact",
        element: <Contact />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Login />
    </>
  );
}

export default App;
