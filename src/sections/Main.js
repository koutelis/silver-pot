import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "sections/Home.js";
import ManageMenu from "components/ManageMenu/ManageMenu.js";
import CreateMenu from "components/CreateMenu/CreateMenu.js";
import WaitersSection from "components/WaitersSection/WaitersSection.js";
import KitchenSection from "components/KitchenSection/KitchenSection.js";
import CashierSection from "components/CashierSection/CashierSection.js";

const Main = () => {
    return <main>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manageMenu" element={<ManageMenu />} />
            <Route path="/createMenu" element={<CreateMenu />} />
            <Route path="/waiters" element={<WaitersSection />} />
            <Route path="/kitchenStaff" element={<KitchenSection />} />
            <Route path="/cashier" element={<CashierSection />} />
        </Routes>
    </main>
}

export default Main;