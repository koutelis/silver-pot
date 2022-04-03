import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "components/Header.js";
import Navbar from "components/NavBar.js";
import Home from "components/Home.js";
import ManageMenu from "components/ManageMenu/ManageMenu.js";
import CreateMenu from "components/CreateMenu/CreateMenu.js";
import WaitersSection from "components/WaitersSection/WaitersSection.js";
import KitchenSection from "components/KitchenSection/KitchenSection.js";
import CashierSection from "components/CashierSection/CashierSection.js";

/**
 * MASTER container of all
 * @returns {JSX}
 */
function App() {
    return (
        <BrowserRouter>
            <header>
                <Header />
            </header>
            <main>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/manageMenu" element={<ManageMenu />} />
                    <Route path="/createMenu" element={<CreateMenu />} />
                    <Route path="/waiters" element={<WaitersSection />} />
                    <Route path="/kitchenStaff" element={<KitchenSection />} />
                    <Route path="/cashier" element={<CashierSection />} />
                </Routes>
            </main>
            <footer>

            </footer>
        </BrowserRouter>
    );
}

export default App;