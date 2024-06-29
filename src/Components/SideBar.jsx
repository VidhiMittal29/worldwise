import React from 'react'
import styles from './Sidebar.module.css';
import AppNav from './AppNav';
import Logo from './Logo';
import { Outlet} from "react-router-dom";

function SideBar() {
  return (
    <div className={styles.sideBar}>
        <Logo/>
        <AppNav/>

        <Outlet/>

        <footer className={styles.footer}>
            <p className={styles.copyright}>
                &copy; Copyright {new Date().getFullYear()} by WorldWise Inc.
            </p>
        </footer>

    </div>
  )
}

export default SideBar