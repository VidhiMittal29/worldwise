import React from "react";
import SideBar from "../Components/SideBar";
import styles from './AppLayout.module.css'
import Map from "../Components/Map";
import User from "../Components/User";

function AppLayout() {
  return (
    <div className={styles.app}>
      <SideBar/>
      <Map/>
      <User/>
    </div>
  );
}

export default AppLayout;
