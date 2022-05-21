import React from "react";
import { Routes, Route } from "react-router-dom";
import { NAV_ROUTES } from "store/config.js";
import Home from "sections/Home.js";
import ManageMenu from "components/ManageMenu/ManageMenu.js";
import CreateMenu from "components/CreateMenu/CreateMenu.js";
import WaitersSection from "components/WaitersSection/WaitersSection.js";
import KitchenSection from "components/KitchenSection/KitchenSection.js";
import BarSection from "components/BarSection/BarSection.js";
import CashierSection from "components/CashierSection/CashierSection.js";

const Main = () => {
    return <main>
        <Routes>
            <Route path={NAV_ROUTES.root.path} element={<Home />} />
            <Route path={NAV_ROUTES.manageMenu.path} element={<ManageMenu />} />
            <Route path={NAV_ROUTES.createMenu.path} element={<CreateMenu />} />
            <Route path={NAV_ROUTES.waitersSection.path} element={<WaitersSection />} />
            <Route path={NAV_ROUTES.kitchenSection.path} element={<KitchenSection />} />
            <Route path={NAV_ROUTES.barSection.path} element={<BarSection />} />
            <Route path={NAV_ROUTES.cashSection.path} element={<CashierSection />} />
        </Routes>
    </main>
}

export default Main;