import {BaseThunk} from "@bponnaluri/places-js";


import {PLAYER_SCORES} from "./InitGlobalStateConfig.ts";
import type {PlayerScoreData} from "./types/PlayerScoreData.ts";

// @ts-ignore

class SessionStoreDataAction {

  async retrieveData(): Promise<any> {
    const scoreData = sessionStorage.getItem(PLAYER_SCORES);
    if(!scoreData){
      return null;
    }

    return JSON.parse(scoreData);
  }
}

export function createPlayerScoresThunk(){
  return new BaseThunk(new SessionStoreDataAction()).addGlobalStateReducer((state:any)=>{
    return {
      [PLAYER_SCORES]: state
    }
  })
}


class UpdatePlayerScoresAction {
  async retrieveData(params:any):Promise<any>{
    let updatedState:PlayerScoreData = {...params.scoreState}

    const scores = updatedState.playerScores;

    for(let i=0;i<scores.length;i++){
      if(scores[i].name === params.playerName){
        scores[i].scoreData["scoreCount"] = params.score;

        if(updatedState.scoreFields.length < params.scoreCount) {
          updatedState.scoreFields.push(""+params.scoreCount);
        }
        break;
      }
    }
    return updatedState
  }
}


export function createUpdatePlayerScoresThunk(){
  return new BaseThunk(new UpdatePlayerScoresAction()).addGlobalStateReducer((state:any)=> {
    return {
      [PLAYER_SCORES]: state
    }
  })
}

