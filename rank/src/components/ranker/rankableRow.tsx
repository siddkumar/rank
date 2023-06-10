import React from "react";

export interface RankableRowProps {
  index: number;
  item: string;
  imageUrl: string | null;
  onDown: () => void;
  onUp: () => void;
  onTop: () => void;
  onBotton: () => void;
}

function MiniPic(url: string | null) {
  return (
    <>
      {!url ? (
        <div className=""></div>
      ) : (
        <img src={url} alt={"i"} className="glyph" />
      )}
    </>
  );
}

export function RankableRow(props: RankableRowProps) {
  console.log(props.imageUrl);
  return (
    <>
      <div className="rankable-row-left">
        <b>{props.index + 1}</b>. {MiniPic(props.imageUrl)} {props.item}
      </div>
      <div className="controls">
        <div onClick={props.onBotton}>
          <i className="fa-solid fa-angles-down"></i>
        </div>
        <div onClick={props.onDown}>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <div onClick={props.onUp}>
          <i className="fa-solid fa-angle-up"></i>
        </div>
        <div onClick={props.onTop}>
          <i className="fa-solid fa-angles-up"></i>
        </div>
      </div>
    </>
  );
}
