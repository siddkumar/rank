import React from "react";
import "./styles/App.css";
import Header from "./pages/header";
import Demo from "./pages/demo";
import Create from "./pages/create/create";
import CreateFromNew from "./pages/create/fromNew";
import CreateFromExisting from "./pages/create/fromExisting";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import CreateFromScratch from "./pages/create/fromScratch";
import Rank from "./pages/rank/rank";
import { CreateFromLink } from "./pages/create/fromLink";
import MyStuff from "./pages/home/myStuff";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="myStuff" element={<MyStuff />}></Route>
        <Route path="demo" element={<Demo />}></Route>
        <Route path="create" element={<Create />}></Route>
        <Route path="create/fromNew" element={<CreateFromNew />}></Route>
        <Route
          path="create/fromExisting"
          element={<CreateFromExisting />}
        ></Route>
        <Route
          path="create/fromScratch"
          element={<CreateFromScratch />}
        ></Route>
        <Route path="create/fromLink" element={<CreateFromLink />}></Route>
        <Route path="rank/" element={<Rank />}></Route>
      </Routes>
    </div>
  );
}

export default App;
