import React, { useState } from "react";
import { FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styles from 'styles/Nav.module.css';


const NavMenu = () => {
    return <>
        <div className={styles["nav-link"]}><NavLink to="/">HOME</NavLink></div>
        <div className={styles["nav-link"]}><NavLink to="/manageFoods">Manage Menu</NavLink></div>
        <div className={styles["nav-link"]}><NavLink to="/createMenu">Create Menu</NavLink></div>
        <div className={styles["nav-link"]}><NavLink to="/waiters">Waiters</NavLink></div>
        <div className={styles["nav-link"]}><NavLink to="/kitchenStaff">Kitchen staff</NavLink></div>
        <div className={styles["nav-link"]}><NavLink to="/cashier">Cashier</NavLink></div>
    </>
}


const Navbar = () => {
    const [hamMenuVisible, setHamMenuVisible] = useState(false);

    const toggleHamMenu = () => {
        setHamMenuVisible(!hamMenuVisible);
    }

    const hamMenuClass = `${styles["nav-menu__ham"]}${hamMenuVisible ? "" : " hidden"}`;

    return (
        <nav>
            <div className={styles["ham-bars"]}>
                <FaBars  onClick={toggleHamMenu} />
                <div className={hamMenuClass}>
                    <NavMenu />
                </div>
            </div>

            <div className={styles["nav-menu"]}>
                <NavMenu />
            </div>
        </nav>
    );
};

export default Navbar;
