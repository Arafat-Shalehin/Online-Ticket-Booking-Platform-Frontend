import React from "react";
import Navbar from "../Common/Navbar";
import {Outlet} from 'react-router'
import Footer from "../Common/Footer";
import ScrollToTop from "../Common/ScrollToTop";

const MainLayout = () => {
  return (
    <div>
      <ScrollToTop/>
      <header>
        <Navbar></Navbar>
      </header>
      <main className='min-h-screen'>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default MainLayout;
