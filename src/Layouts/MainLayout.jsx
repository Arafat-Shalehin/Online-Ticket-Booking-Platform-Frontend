import React from "react";
import Navbar from "../Components/Common/Navbar";
import {Outlet} from 'react-router'
import Footer from "../Components/Common/Footer";
import ScrollToTop from "../Components/Common/ScrollToTop";

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
