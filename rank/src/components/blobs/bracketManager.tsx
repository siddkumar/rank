import React from "react";
import RankableItem from "../../models/RankableItem";
import "../../styles/bracket.css"

export interface BracketManagerProps {
    blobs: RankableItem[];
}

function BracketManager (props: BracketManagerProps) {
    
    const seeds = new Map();
    props.blobs.map((item, index) => {
        seeds.set(index + 1, item)
    });

    const numItems = props.blobs.length;

    var exponent = 0;
    while (exponent < 10) {
        var total = 2 ** exponent;
        if (numItems < total)
        {
            for (var i = numItems; i < total ; i ++)
            {
                seeds.set(i +1, {name : "BYE", rank: i})
            }
            break;
        }
        exponent ++;
    }

    const seedings = seeding( 2** exponent)
    var matchupList : any[] = [];

    for (var i = 0; i < seedings.length; i += 2)
    {
        matchupList.push([seedings.at(i), seedings.at(i+1)]);
    }
    return (
        <div>
            <div>
                <div>Round 1</div>
                <div className="round-container">
                {
                    matchupList.map((item,index) => { 
                        var x = seeds.get(item.at(0))
                        var y = seeds.get(item.at(1))
                        return (
                            <div key={x.name + "vs" + y.name}className="matchup-container">
                                <div key={x.name + x.rank} className="row card item-container">
                                    <div>{x.rank + 1}.{x.name}</div>
                                    <div className="controls">
                                        <div onClick={() => console.log("click")}>
                                        <i className="fa-solid fa-square-caret-right"></i>
                                        </div>
                                    </div>
                                </div>
                                <div key={y.name + y.rank} className="row card item-container">
                                    <div>{y.rank + 1}.{y.name}</div>
                                    <div className="controls">
                                        <div onClick={() => console.log("click")}>
                                        <i className="fa-solid fa-square-caret-right"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    )})
                }
                </div>
            </div>
        </div>
    )
}

function seeding(numPlayers : number){
    var rounds = Math.log(numPlayers)/Math.log(2)-1;
    var pls = [1,2];
    for(var i=0;i<rounds;i++){
      pls = nextLayer(pls);
    }
    return pls;

    function nextLayer(pls: any){
      var out: number[]=[];
      var length = pls.length*2+1;
      pls.forEach(function(d: number){
        out.push(d);
        out.push(length-d);
      });
      return out;
    }
  }

export default BracketManager;