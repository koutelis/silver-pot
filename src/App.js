import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "components/Header.js";
import Navbar from "components/NavBar.js";
import Home from "components/Home.js";
import ManageFoods from "components/ManageMenu/ManageFoods.js";

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
                    <Route path="/manageFoods" element={<ManageFoods />} />
                    <Route path="/createMenu" element={<Home />} />
                    <Route path="/waiters" element={<Home />} />
                    <Route path="/kitchenStaff" element={<Home />} />
                    <Route path="/cashier" element={<Home />} />
                </Routes>
            </main>
            <footer>

            </footer>
        </BrowserRouter>
    );
}

export default App;
