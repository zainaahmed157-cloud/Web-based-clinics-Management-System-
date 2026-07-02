import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../component/nav'
import Footer from '../component/footer'

export default function Layout() {
  const [isEnglish, setIsEnglish] = useState(false);

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav isEnglish={isEnglish} setIsEnglish={setIsEnglish} />
      
      <div className='grow'>
        <Outlet/>
      </div>
      <Footer isEnglish={isEnglish} />
    </div>
  )
}