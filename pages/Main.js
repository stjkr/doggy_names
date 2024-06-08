import React, { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


import Sidebar from './components/sidebar';

import Contribute from './components/Contribute';
import Choose from './components/Choose';

export default function Main() {
  

  const [showSideBar, setShowSideBar] = useState(false);
  const toggleSidebar = () => {
    setShowSideBar(!showSideBar);
  }

  const [appRoute, setAppRoute] = useState(false)
  const toggleRoute = (type) => {
    if (type === "contribute"){
        setAppRoute(true);
    } else {
        setAppRoute(false);
    }
    
  }

  return (
    <main className={styles.main}>



      <div className={styles.App}>
        <div className={styles.Header}>
          <div>Doggy Names / <p onClick={() => toggleRoute("choose")}>choose</p> / <p onClick={() => toggleRoute("contribute")}>contribute</p> </div>
          <div>🐾</div>
        </div>
        {appRoute ? (<Contribute/>) : (<Choose/>)}
        
          

        <div className={styles.Header}>
          <div className={styles.documentation}>
            <p onClick={toggleSidebar}>Documentation</p>
          </div>
          <div>
            <text>Made with ❤️ by <a target="_blank" href="https://github.com/stjkr">stjkr</a>.</text>
          </div>
        </div>
        <div><Toaster position="top-center" /></div>
        {showSideBar && (<Sidebar toggle={toggleSidebar}  />)}
      </div>
    </main>
  );
}
