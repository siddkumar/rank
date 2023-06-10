import React, { useEffect, useState } from "react";
import { GetImgSrc } from "../../services/parserService";

interface TemplateEditorProps {
  initialName: string;
  initialItems: string[];
  onSubmit: (name: string, items: string[], images?: string[]) => void;

  initialHelperLinks?: string[];
}

interface ItemCandidate {
  title: string;
  helper?: string;
  image: string;
}

export function TemplateEditor(props: TemplateEditorProps) {
  const [templateName, setTemplateName] = useState(props.initialName);

  const [items, setItems] = useState<ItemCandidate[]>(
    props.initialItems.map((item, i) => {
      return {
        title: item,
        image: "",
        helper: props?.initialHelperLinks?.at(i),
      };
    })
  );
  const [cursorMover, setCursorMover] = useState(0);

  useEffect(() => {
    var elem = document.getElementById(cursorMover + "-key");
    if (elem) {
      elem.focus();
    }
  }, [cursorMover]);

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
      { title: event.target.value, image: items.at(position)!.image },
      ...items.slice(position + 1),
    ]);
  };

  const handleKeyDown = (e: any, i: number, item: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursorMover(Math.max(i - 1, 0));
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursorMover(Math.min(i + 1, items.length));
    }

    if (e.key === "Backspace" && item.length === 0) {
      e.preventDefault();
      removeItem(i);
    }
  };

  const addItem = () => {
    setItems([...items, { title: "", image: "" }]);
    setCursorMover(items.length);
  };

  const removeItem = (position: number) => {
    if (items.length === 1) {
      return;
    }
    setItems([...items.slice(0, position), ...items.slice(position + 1)]);
    setCursorMover(Math.max(0, position - 1));
  };

  function pullImage(item: ItemCandidate, index: number) {
    GetImgSrc(item.helper!).then((s) => {
      console.log(s);
      setItems([
        ...items.slice(0, index),
        { title: item.title, image: s ?? "", helper: item.helper! },
        ...items.slice(index + 1),
      ]);
    });
  }

  function MiniPic(item: ItemCandidate, index: number) {
    if (item.image) {
      return <img src={item.image} alt={"i"} className="glyph" />;
    }

    if (item.helper) {
      return (
        <i
          onClick={(e) => pullImage(item, index)}
          className="fa-solid fa-file-arrow-down"
        ></i>
      );
    } else {
      return <></>;
    }
  }

  async function pullImages() {
    const processedItems = await Promise.all(
      items.map(async (i) => {
        if (i.helper) {
          return {
            title: i.title,
            helper: i.helper,
            image: await GetImgSrc(i.helper!),
          };
        } else {
          return i;
        }
      })
    );
    setItems(processedItems);
  }

  function GetAllPics() {
    return (
      <div className="row">
        <div className="main-subtitle">Download all images:</div>
        <i
          onClick={async (e) => await pullImages()}
          className="fa-solid fa-file-zipper"
        ></i>
      </div>
    );
  }

  return (
    <>
      <label className="main-subtitle">Name:&nbsp;</label>
      <input type="text" value={templateName} onChange={onChangeTemplateName} />
      {props.initialHelperLinks ? GetAllPics() : <></>}
      <div className="main-subtitle">Rankable Items:</div>
      {items.map((item, i) => (
        <div key={i + "div-key"} className="row">
          {MiniPic(item, i)}
          <input
            id={i + "-key"}
            key={i + "-key"}
            placeholder={"Type and Enter"}
            type="text"
            value={item.title}
            onChange={(e) => handleUserInputChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i, item.title)}
          ></input>
          <div key={i + "-button-key"} onClick={(e) => removeItem(i)}>
            <i className="fa-solid fa-trash icon-override"></i>
          </div>
        </div>
      ))}
      <button
        onClick={() =>
          props.onSubmit(
            templateName,
            items.map((i) => i.title),
            items.map((i) => i.image)
          )
        }
        className="button-styles done-button"
      >
        Submit
      </button>
    </>
  );
}
