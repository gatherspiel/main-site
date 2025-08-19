import {BaseThunk} from "@bponnaluri/places-js";


import {PLAYER_SCORES} from "./InitGlobalStateConfig.ts";
import type {PlayerScore, PlayerScoreData} from "./types/PlayerScoreData.ts";

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

    console.log(params);

    scores.forEach((playerScore: PlayerScore)=>{
      console.log("Hi")
      if(playerScore.name === params.playerName){

        playerScore.scoreData[""+updatedState.scoreFields.length+1] = params.score;


        if(updatedState.scoreFields.length < params.scoreCount+1) {
          updatedState.scoreFields.push(""+params.scoreCount);
        }
      }
    });

    return updatedState;

  }
}


export function createUpdatePlayerScoresThunk(){
  return new BaseThunk(new UpdatePlayerScoresAction()).addGlobalStateReducer((state:any)=> {
    return {
      [PLAYER_SCORES]: state
    }
  })
}


class CreateNewPlayerAction {
  async retrieveData(params:any):Promise<any> {
    const scores = params.scoreState;
    scores.playerScores.push({
      name: params.playerName,
      scoreData: {}
    })

    return scores;
  }
}

export function createNewPlayerThunk() {
  return new BaseThunk(new CreateNewPlayerAction()).addGlobalStateReducer((state:any)=>{
    return {
      [PLAYER_SCORES]:state
    }
  })
}