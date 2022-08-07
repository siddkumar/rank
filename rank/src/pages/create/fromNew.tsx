import React from "react";
import "../../styles/create.css";

function CreateFromNew() {
  return (
    <div className="create-page-layout">
      <div className="main-title">Let's create a template</div> 
      <div className="main-subtitle">How do you want to build your template?</div>
      <a href="/create/fromScratch"><button className="button-styles">from scratch</button></a>
      <div>or</div>
      <a href="/create/fromLink"><button className="button-styles">from a link</button></a>
    </div>
  );
}

export default CreateFromNew;
