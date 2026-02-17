"use client";

import React from "react";
import { Icon } from "../common/Icon";

import styles from "./rankableRow.module.css";

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
        <div className={styles.glyphStub}></div>
      ) : (
        <img src={url} alt={"i"} className={styles.glyph} />
      )}
    </>
  );
}

export function RankableRow(props: RankableRowProps) {
  return (
    <>
      <div className={styles.rankableRowLeft}>
        <b>{props.index + 1}</b>. {MiniPic(props.imageUrl)} {props.item}
      </div>
      <div className={styles.controls}>
        <div onClick={props.onBotton}>
          <Icon className="fa-solid fa-angles-down" />
        </div>
        <div onClick={props.onDown}>
          <Icon className="fa-solid fa-angle-down" />
        </div>
        <div onClick={props.onUp}>
          <Icon className="fa-solid fa-angle-up" />
        </div>
        <div onClick={props.onTop}>
          <Icon className="fa-solid fa-angles-up" />
        </div>
      </div>
    </>
  );
}
