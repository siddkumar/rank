import React, { useEffect, useState } from "react";

interface TemplateEditorProps {
  initialName: string;
  initialItems: string[];
  onSubmit: (name: string, items: string[]) => void;
}

export function TemplateEditor(props: TemplateEditorProps) {
  const [templateName, setTemplateName] = useState(props.initialName);
  const [items, setItems] = useState(props.initialItems);
  const [cursorMover, setCursorMover] = useState(0)

  useEffect(() => {
    var elem = document.getElementById(cursorMover + "-key");
    if (elem) {
      elem.focus();
    }
  }, [cursorMover])

  const onChangeTemplateName = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTemplateName(event.target.value);
  };

  const handleUserInputChange = (
    event: { target: { value: string } },
    position: number
  ) => {
    setItems([
      ...items.slice(0, position),
      event.target.value,
      ...items.slice(position + 1),
    ]);
  };

  const handleKeyDown = (e: any, i: number, item: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursorMover(Math.max(i -1, 0))
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursorMover(Math.min(i+1, items.length))
    }

    if (e.key === "Backspace" && item.length === 0) {
      e.preventDefault();
      removeItem(i);
    }
  }

  const addItem = () => {
    setItems([...items, ""]);
    setCursorMover(items.length);
  };

  const removeItem = (position: number) => {
    if (items.length === 1) {
      return
    }
    setItems([...items.slice(0, position), ...items.slice(position + 1)]);
    setCursorMover(Math.max(0, position -1));
  };

  return (
    <>
      <label className="main-subtitle">Name:&nbsp;</label>
      <input type="text" value={templateName} onChange={onChangeTemplateName} />
      <div className="main-subtitle">Rankable Items:</div>
      {items.map((item, i) => (
        <div key={i + "div-key"} className="row">
          <input
            id = {i+"-key"}
            key={i + "-key"}
            placeholder={"Type and Enter"}
            type="text"
            value={item}
            onChange={(e) => handleUserInputChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i, item)}
          ></input>
          <div key={i + "-button-key"} onClick={(e) => removeItem(i)}>
            <i className="fa-solid fa-trash icon-override"></i>
          </div>
        </div>
      ))}
      <button
        onClick={() => props.onSubmit(templateName, items)}
        className="button-styles done-button"
      >
        Submit
      </button>
    </>
  );
}
