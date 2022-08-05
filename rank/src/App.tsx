import React from "react";
import "./styles/App.css";
import Header from "./pages/header";
import Demo from "./pages/demo";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";

function Main() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="demo" element={<Demo/>}></Route>
      </Routes>
    </div>
  );
}

function App() {
  return <Main />;
}

export default App;
