import { useState } from 'react'
import './App.css'
import { HashRouter  as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Menu from "./components/Menu";
import Quiz from "./components/Quiz";
import error from "./components/error"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Quiz" element={<Quiz />} />
        <Route path="/error" element={<error />} />
      </Routes>
    </Router>
  );
}

export default App;
