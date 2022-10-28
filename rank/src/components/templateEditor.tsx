import React, { useState } from "react";

interface TemplateEditorProps {
  initialName: string;
  initialItems: string[];
  onSubmit: (name: string, items: string[]) => void;
}

export function TemplateEditor(props: TemplateEditorProps) {
  const [templateName, setTemplateName] = useState(props.initialName);
  const [items, setItems] = useState(props.initialItems);

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

  const addItem = () => {
    setItems([...items, ""]);
  };

  const removeItem = (position: number) => {
    setItems([...items.slice(0, position), ...items.slice(position + 1)]);
  };

  return (
    <>
      <label className="main-subtitle">Name:&nbsp;</label>
      <input type="text" value={templateName} onChange={onChangeTemplateName} />
      <div className="main-subtitle">Rankable Items:</div>
      {items.map((item, i) => (
        <div key={i + "div-key"}>
          <input
            key={i + "-key"}
            type="text"
            value={item}
            onChange={(e) => handleUserInputChange(e, i)}
          ></input>
          <button
            key={i + "-button-key"}
            className="add-remove-button"
            onClick={(e) => removeItem(i)}
          >
            remove
          </button>
        </div>
      ))}
      <button onClick={addItem} className="add-remove-button">
        add item
      </button>
      <button
        onClick={() => props.onSubmit(templateName, items)}
        className="button-styles done-button"
      >
        i'm done
      </button>
    </>
  );
}
