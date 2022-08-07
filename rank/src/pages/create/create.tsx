import React from "react";
import "../../styles/create.css";

function Create() {
  return (
    <div className="create-page-layout">
      <div className="main-title">Let's start ranking!</div> 
      <div className="main-subtitle">Where do you want to pick your template from?</div>
      <a href="/create/fromNew"><button className="button-styles">create a new template</button></a>
      <div>or</div>
      <a href="/create/fromExisting"><button className="button-styles">use an existing one</button></a>
    </div>
  );
}

export default Create;
