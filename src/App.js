import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "components/Header.js";
import Main from "components/Main.js";
import Footer from "components/Footer.js"

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