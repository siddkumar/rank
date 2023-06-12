import React, { useEffect, useState } from "react";
import RankableItem, { RankableDefaultString } from "../../models/RankableItem";
import "../../styles/bracket.css";
import BracketRound from "./bracketRound";

export interface BracketManagerProps {
  bracketItems: RankableItem[];
}

enum BracketViews {
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop",
}

function BracketManager(props: BracketManagerProps) {
  const seeds = new Map();
  var maxLen = 0;
  props.bracketItems.forEach((item, index) => {
    seeds.set(index + 1, item);
    if (item.name.length > maxLen) {
      maxLen = item.name.length;
    }
  });

  var seedsPerRound = [seeds];

  const numItems = props.bracketItems.length;

  // Add Bye Items until nearest power of 2
  var exponent = 0;
  while (exponent < 10) {
    var total = 2 ** exponent;
    if (numItems < total) {
      for (var i = numItems; i < total; i++) {
        seeds.set(i + 1, { name: "BYE", rank: i });
      }
      break;
    }
    exponent++;
  }

  // Create matchups for each round
  var rounds = [];
  for (var e = exponent; e > 0; e -= 1) {
    var round = [];
    var psuedoSeeds = seeding(2 ** e);
    for (var ps = 0; ps < psuedoSeeds.length; ps += 2) {
      round.push([psuedoSeeds.at(ps), psuedoSeeds.at(ps + 1)]);
    }

    // Set Initial Bracket
    if (e !== exponent) {
      var s = new Map();
      for (var x = 0; x < psuedoSeeds.length; x += 1) {
        s.set(x + 1, { name: RankableDefaultString, rank: x });
      }
      seedsPerRound.push(s);
    }

    rounds.push(round);
  }

  const [roundByRound, setRoundByRound] = useState(seedsPerRound);
  const [winner, setWinner] = useState<string | null>(null);
  const [mobileRoundView, setRoundView] = useState(0);

  const width = window.innerWidth;
  var defaultView = BracketViews.TABLET;
  if (width >= 1024) {
    defaultView = BracketViews.DESKTOP;
  } else if (width >= 768) {
    defaultView = BracketViews.TABLET;
  } else {
    defaultView = BracketViews.MOBILE;
  }

  const [view, setView] = useState(defaultView);

  function advance(psuedoSeed: number, i: RankableItem, round: number) {
    if (round + 1 === roundByRound.length) {
      setWinner(i.name);
      return;
    }
    var newRoundByRound = [...roundByRound];
    var replacing = newRoundByRound[round + 1].get(psuedoSeed);
    newRoundByRound[round + 1].set(psuedoSeed, i);

    if (replacing.name === winner) {
      setWinner(null);
    }

    for (var j = round + 2; j < roundByRound.length; j++) {
      let keytoNullOut = null;
      let ranktoNullOut = null;
      newRoundByRound[j].forEach((value: RankableItem, key: number) => {
        if (value.name === replacing.name) {
          keytoNullOut = key;
          ranktoNullOut = value.rank;
        }
      });
      if (keytoNullOut) {
        newRoundByRound[j].set(keytoNullOut, {
          name: RankableDefaultString,
          rank: ranktoNullOut,
        });
      }
    }
    setRoundByRound(newRoundByRound);
  }

  // advance byes
  let r1 = rounds[0];
  r1.forEach((item, index) => {
    if (roundByRound[0].get(item[1]).name === "BYE") {
      roundByRound[1].set(item[0], roundByRound[0].get(item[0]));
    }
  });

  function renderDesktopView(
    rounds: any[],
    startIdx = 0,
    endIdx = rounds.length,
    showTrophy = true
  ) {
    return (
      <div className="bracket-container">
        {rounds.slice(startIdx, endIdx + 1).map((item, index) => {
          return (
            <BracketRound
              key={index}
              matchupList={item}
              seeds={roundByRound[index]}
              roundNumber={index + 1}
              clickCallback={advance}
            />
          );
        })}
        {showTrophy && (
          <div className="round-container">
            <div className="item-container card row">
              {winner ?? RankableDefaultString}
              <div className="controls">
                <i className="fa-solid fa-trophy"></i>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderMobileView(rounds: any[], currentRound: number) {
    if (currentRound === rounds.length) {
      return (
        <div className="mobile-bracket-container">
          <button
            className="previous-button"
            onClick={(e) => setRoundView(Math.max(currentRound - 1, 0))}
          ></button>
          <div className="round-container">
            <div className="item-container card row">
              {winner ?? RankableDefaultString}
              <div className="controls">
                <i className="fa-solid fa-trophy"></i>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mobile-bracket-container">
        <button
          className="previous-button"
          onClick={(e) => setRoundView(Math.max(currentRound - 1, 0))}
        ></button>
        {renderDesktopView(rounds, currentRound, currentRound, false)}
        <button
          className="next-button"
          onClick={(e) =>
            setRoundView(Math.min(currentRound + 1, rounds.length))
          }
        ></button>
      </div>
    );
  }

  function renderTabletView(rounds: any[], currentRound: number) {
    return (
      <div className="mobile-bracket-container">
        <button
          className="previous-button"
          onClick={(e) => setRoundView(Math.max(currentRound - 1, 1))}
        ></button>
        {renderDesktopView(
          rounds,
          currentRound - 1,
          currentRound + 1,
          currentRound === rounds.length - 1
        )}
        <button
          className="next-button"
          onClick={(e) =>
            setRoundView(Math.min(currentRound + 1, rounds.length - 1))
          }
        ></button>
      </div>
    );
  }

  return (
    <div>
      <div className="row card container caveat">
        <div>
          Switch View
          <i
            onClick={(e) => setView(BracketViews.DESKTOP)}
            className="fa-solid fa-desktop"
          ></i>
          <i
            onClick={(e) => setView(BracketViews.TABLET)}
            className="fa-solid fa-tablet-screen-button"
          ></i>
          <i
            onClick={(e) => setView(BracketViews.MOBILE)}
            className="fa-solid fa-mobile-screen-button"
          ></i>
        </div>
      </div>
      {view === BracketViews.DESKTOP && renderDesktopView(rounds)}
      {view === BracketViews.TABLET &&
        renderTabletView(rounds, Math.max(mobileRoundView, 1))}
      {view === BracketViews.MOBILE &&
        renderMobileView(rounds, mobileRoundView)}
    </div>
  );
}

// Gets matchups for each round
function seeding(numPlayers: number) {
  var rounds = Math.log(numPlayers) / Math.log(2) - 1;
  var pls = [1, 2];
  for (var i = 0; i < rounds; i++) {
    pls = nextLayer(pls);
  }
  return pls;

  function nextLayer(pls: any) {
    var out: number[] = [];
    var length = pls.length * 2 + 1;
    pls.forEach(function (d: number) {
      out.push(d);
      out.push(length - d);
    });
    return out;
  }
}

export default BracketManager;
