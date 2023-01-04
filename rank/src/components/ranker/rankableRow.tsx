import React from "react";

export interface RankableRowProps {
  index: number;
  item: string;
  onDown: () => void;
  onUp: () => void;
  onTop: () => void;
  onBotton: () => void;
}

export function RankableRow(props: RankableRowProps) {
  return (
    <>
      <div>
        <b>{props.index + 1}</b>. {props.item}
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
