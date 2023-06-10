import React, { useEffect, useState } from "react";
import { GetImgSrc } from "../../services/parserService";
import { ItemCandidate } from "./templateEditor";

interface TemplateIconSetterProps {
  item: ItemCandidate;
  index: number;
  onSave: (s: string) => void; // Set the Image Url
}

async function pullImage(item: ItemCandidate) {
  return await GetImgSrc(item.helper!);
}

enum TemplateIconSetterViews {
  IconImage = "IconImage",
  IconDownload = "DownloadImage",
  TextInputBox = "TextInputBox",
  ImageImage = "Image",
}

export default function TemplateIconSetter(props: TemplateIconSetterProps) {
  const item = props.item;
  const [imageUrl, setImageUrl] = useState(item.image);
  const [view, setView] = useState<TemplateIconSetterViews>(
    TemplateIconSetterViews.IconImage
  );

  useEffect(() => {
    setImageUrl(item.image);
    if (item.image) {
      setView(TemplateIconSetterViews.ImageImage);
    } else if (item.helper) {
      setView(TemplateIconSetterViews.IconDownload);
    } else {
      setView(TemplateIconSetterViews.IconImage);
    }
  }, [item]);

  function IconImageView() {
    return (
      <i
        onClick={(e) => {
          setView(TemplateIconSetterViews.TextInputBox);
        }}
        className="fa-regular fa-image"
      ></i>
    );
  }

  function IconDownloadView() {
    return (
      <i
        onClick={(e) => pullImage(item).then((s) => props.onSave(s))}
        className="fa-solid fa-file-arrow-down no-left"
      ></i>
    );
  }

  function TextInputView() {
    return (
      <>
        <input
          type="text"
          placeholder="Paste img url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        ></input>
        <i
          onClick={(e) => props.onSave(imageUrl)}
          className="fa-regular fa-floppy-disk no-left"
        ></i>
      </>
    );
  }

  function ImageImageView() {
    return (
      <img
        onClick={(_e) => setView(TemplateIconSetterViews.TextInputBox)}
        src={item.image}
        alt={"i"}
        className="glyph pointer no-left"
      />
    );
  }

  return (
    <>
      {view === TemplateIconSetterViews.IconImage && IconImageView()}
      {view === TemplateIconSetterViews.IconDownload && IconDownloadView()}
      {view === TemplateIconSetterViews.TextInputBox && TextInputView()}
      {view === TemplateIconSetterViews.ImageImage && ImageImageView()}
    </>
  );
}
