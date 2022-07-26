import React from "react";
import "./App.css";
import Header from "./pages/header";
import Demo from "./pages/demo";

function Main() {
  return (
    <div>
      <Header title={"demo"} />
      {getPage()}
    </div>
  );
}

function getPage() {
  return <Demo />;
}

function App() {
  return <Main />;
}

export default App;
