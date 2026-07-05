
import React from 'react';
import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Nav from './component/nav'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/layout'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Clinics from './pages/Clinics'
import Appointments from './pages/Appointments'
import About from './pages/About'
import Contact from './pages/Contact'
import Specialties from './pages/Specialties'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import { useTranslation } from "react-i18next";
const router =createBrowserRouter([
  {
    path :"/",
    element : <Layout/>,
    children:[{
    path :"/",
    element : <Home/>,
    },
    {
    path :"/Specialties",
    element : <Specialties/>,
    },
    {
    path :"/Doctors",
    element : <Doctors/>,
    },
    {
    path :"/Clinics",
    element : <Clinics/>,
    },
    {
    path :"/Appointments",
    element : <Appointments/>,
    },
    {
    path :"/About",
    element : <About/>,
    },
    {
    path :"/Contact",
    element : <Contact/>,
    },
  ],
  
  }
  ,{
    path :"/Login",
    element : <Login/>,
    },
    {
    path :"/CreateAccount",
    element : <CreateAccount/>,
    }
])
function App() {
    const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
}, [i18n.language]);
  return (
      <>
  <RouterProvider router={router} />
    </>
  )
}

export default App
