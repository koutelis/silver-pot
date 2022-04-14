import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "sections/Header.js";
import Main from "sections/Main.js";
import Footer from "sections/Footer.js"

/**
 * MASTER container of all
 * @returns {JSX}
 */
function App() {
    return <BrowserRouter>
        <Header />
        <Main />
        <Footer />
    </BrowserRouter>
}

export default App;