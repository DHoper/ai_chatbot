import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/views/Home";
import Chat from "@/views/Chat";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/" element={<Chat />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    );
};

export default App;
