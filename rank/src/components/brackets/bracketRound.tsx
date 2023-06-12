import React from "react";
import RankableItem, { RankableDefaultString } from "../../models/RankableItem";

export interface BracketRoundProps {
  seeds: Map<number, any>;
  matchupList: any[];
  roundNumber: number;
  clickCallback: (psuedoSeed: number, i: RankableItem, round: number) => void;
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

function BracketRound(props: BracketRoundProps) {
  return (
    <div
      className={
        "round-container " +
        (props.roundNumber % 2 === 0 ? "bg-even" : "bg-odd")
      }
    >
      {props.matchupList.map((item, index) => {
        var x = props.seeds.get(item.at(0));
        var y = props.seeds.get(item.at(1));
        var psuedoSeed = Math.min(item.at(0), item.at(1));
        return (
          <div
            key={index + "." + x.name + "vs" + y.name + "." + props.roundNumber}
            className="matchup-container"
          >
            <div
              key={x.name + x.rank + "." + props.roundNumber}
              className="row card item-container pointer"
              onClick={() =>
                props.clickCallback(psuedoSeed, x, props.roundNumber - 1)
              }
            >
              {MiniPic(x?.imageUrl)}
              <div>{getNiceString(x.name, x.rank)}</div>
              <div className="controls">
                <i className="fa-solid fa-square-caret-right"></i>
              </div>
            </div>
            <div
              key={y.name + y.rank + props.roundNumber}
              className="row card item-container pointer"
              onClick={() =>
                props.clickCallback(psuedoSeed, y, props.roundNumber - 1)
              }
            >
              {MiniPic(y?.imageUrl)}
              <div>{getNiceString(y.name, y.rank)}</div>
              <div className="controls">
                <i className="fa-solid fa-square-caret-right"></i>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getNiceString(name: string, rank: number) {
  if (name === RankableDefaultString) {
    return name;
  } else {
    return rank + 1 + "." + name;
  }
}

export default BracketRound;
