import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Zoom from './components/zoom';
import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import Home from './components/home';
function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<Zoom roomIdNew={"076b4545-9cea-4daa-8371-a4f48f6dfe8e"} />} />
        {/* <Route exact path='/' element={<Home />} /> */}

      </Routes>
    </>

  );
}

export default App;
