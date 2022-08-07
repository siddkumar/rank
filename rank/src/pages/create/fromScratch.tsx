import React, { useState } from "react";
import "../../styles/create.css";

function CreateFromScratch() {
  const [templateName, setTemplateName] = useState("");
  const [items, setItems] = useState([""]);

  const onChangeTemplateName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTemplateName(event.target.value);
  }

  const handleUserInputChange = (event: { target: { value: string; };} , position: number ) => {
    setItems([...items.slice(0, position), event.target.value, ...items.slice(position+1)]);
  };
  
  const addItem = () => {
    setItems([...items, ""])
  }

  const removeItem = (position: number) => {
    setItems([...items.slice(0, position), ...items.slice(position+1)]);
  }

  return (
    <div className="create-page-layout">
      <div className="main-title">Let's create a template</div>
      <label className="main-subtitle">Template Name:&nbsp;</label>
        <input type="text" value={templateName} onChange={onChangeTemplateName} />
        <div className="main-subtitle">Rankable Things:</div>
        {
          items.map(
            (item, i) => 
              <div>
              <input key={i+"-key"}type="text" value={item} onChange={(e)=>handleUserInputChange(e,i)}></input>
              <button className="close" onClick={(e) => removeItem(i)}>remove </button>
              </div>
            )
        }
        <button onClick={addItem} className="button-styles">Add Item</button>
      <button className="button-styles">i'm done</button>
    </div>
  );
}

export default CreateFromScratch;
