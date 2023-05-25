import React from "react";
import "./styles/App.css";
import Header from "./pages/header";
import Create from "./pages/create/create";
import { Route, Routes } from "react-router-dom";
import CreateFromScratch from "./pages/create/fromScratch";
import Rank from "./pages/rank/rank";
import { CreateFromLink } from "./pages/create/fromLink";
import MyStuff from "./pages/home/myStuff";
import SignIn from "./pages/home/signIn";
import RankEdit from "./pages/rank/rankEdit";
import Footer from "./pages/footer";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="myStuff" element={<MyStuff />}></Route>
        <Route path="signIn" element={<SignIn />}></Route>
        <Route path="/" element={<Create />}></Route>
        <Route
          path="create/fromScratch"
          element={<CreateFromScratch />}
        ></Route>
        <Route path="create/fromLink" element={<CreateFromLink />}></Route>
        <Route path="rank/" element={<Rank />}></Route>
        <Route path="rank/edit" element={<RankEdit />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
