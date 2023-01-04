import React, { useState } from "react";
import RankableItem, { RankableDefaultString } from "../../models/RankableItem";
import "../../styles/bracket.css";
import BracketRound from "./bracketRound";

export interface BracketManagerProps {
  bracketItems: RankableItem[];
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
    console.log(item);
    if (roundByRound[0].get(item[1]).name === "BYE") {
      console.log(item.at(0));
      roundByRound[1].set(item[0], roundByRound[0].get(item[0]));
    }
  });

  return (
    <div>
      <div className="bracket-container">
        {rounds.map((item, index) => {
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
        <div className="round-container">
          <div className="item-container card row">
            {winner ?? RankableDefaultString}
            <div className="controls">
              <i className="fa-solid fa-trophy"></i>
            </div>
          </div>
        </div>
      </div>
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
