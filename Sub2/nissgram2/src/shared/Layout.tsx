import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './SideBar';
import Footer from './Footer';
import './../styles/layout.css';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
   <>
      <Header />
        <Sidebar />
        <main className="content-container">{children || <Outlet />}</main>
      <Footer />
      </>
  );
};

export default Layout;