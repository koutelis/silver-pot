import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import styles from "styles/NavBar.module.css";

const NavMenu = (props) => {
    // className={styles["nav-link__active"]} 
    return <>
        <div className={styles["nav-link"]} {...props}><NavLink to="/">HOME</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/manageMenu">Manage Menu</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/createMenu">Create Menu</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/waiters">Waiters</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/kitchenStaff">Kitchen staff</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/cashier">Cashier</NavLink></div>
    </>
}

const Navbar = () => {
    const [hamMenuVisible, setHamMenuVisible] = useState(false);

    const toggleHamMenu = () => setHamMenuVisible(!hamMenuVisible);

    const cbCloseHamMenu = () => setHamMenuVisible(false);

    const hamMenuClass = `${styles["nav-menu__ham"]}${hamMenuVisible ? "" : " hidden"}`;

    return (
        <div className={styles["nav-container"]}>
            <nav>
                <div className={styles["ham-bars"]}>
                    <FaBars onClick={toggleHamMenu} />
                    <div className={hamMenuClass}>
                        <NavMenu onClick={cbCloseHamMenu}/>
                    </div>
                </div>
                <div className={styles["nav-menu"]}>
                    <NavMenu />
                </div>
            </nav>
        </div>
    );
};

export default Navbar;