import React from "react";
import Navbar from "../Common/Navbar";
import {Outlet} from 'react-router'
import Footer from "../Common/Footer";

const MainLayout = () => {
  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default MainLayout;
