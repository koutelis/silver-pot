import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import styles from "styles/Header.module.css";

const Header = () => {
    return <header>
        <Navbar />
    </header>
}

const Navbar = () => {
    const [hamMenuVisible, setHamMenuVisible] = useState(false);

    const toggleHamMenu = () => setHamMenuVisible(!hamMenuVisible);

    const cbCloseHamMenu = () => setHamMenuVisible(false);

    const hamMenuClass = `${styles["nav-menu__portrait"]}${hamMenuVisible ? "" : " hidden"}`;

    return <nav>
        <div className={styles["hamburger"]}>
            <FaBars onClick={toggleHamMenu} />
            <div className={hamMenuClass}>
                <NavMenu onClick={cbCloseHamMenu}/>
            </div>
        </div>
        <div className={styles["nav-menu__landscape"]}>
            <NavMenu />
        </div>
    </nav>
};

const NavMenu = (props) => {
    return <>
        <div className={styles["nav-link"]} {...props}><NavLink to="/">HOME</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/manageMenu">Manage Menu</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/createMenu">Create Menu</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/waiters">Waiters</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/kitchenStaff">Kitchen staff</NavLink></div>
        <div className={styles["nav-link"]} {...props}><NavLink to="/cashier">Cashier</NavLink></div>
    </>
}

export default Header;