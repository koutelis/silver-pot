import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { NAV_ROUTES } from "store/config.js";
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
    const navLinks = Object.values(NAV_ROUTES).map((route, index) => {
        return <div key={index} className={styles["nav-link"]}{...props}>
            <NavLink to={route.path}>{route.label}</NavLink>
        </div>
    })
    
    return <>
        {navLinks}
    </>
}

export default Header;