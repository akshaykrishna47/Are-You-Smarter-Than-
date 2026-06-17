import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Menu from "./components/Menu";
import Quiz from "./components/Quiz"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
