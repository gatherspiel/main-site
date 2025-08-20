
import type {EventHandlerThunkConfig} from "../framework/src";
import type {PlayerScore, PlayerScoreData} from "./types/PlayerScoreData.ts";
import {PLAYER_SCORES} from "./ScoreTrackerComponent.ts";

export const ADD_PLAYER_HANDLER: EventHandlerThunkConfig = {
  eventHandler:(params:any)=>{
    return {
      playerName:params.formSelector.getValue("add_player_input"),
      scoreState: params.componentStore
    }
  },
  globalStoreReducer:(params:any)=>{
    const scores = params.scoreState;

    const updatedScores:PlayerScore[] = Array.from(scores.playerScores)

    updatedScores.push({
      name: params.playerName,
      scoreData: {}
    })

    console.log(updatedScores)
    return {
      [PLAYER_SCORES]: {
        scoreFields: scores.scoreFields,
        playerScores: updatedScores
      }
    }
  }
}

export const UPDATE_SCORE_HANDLER: EventHandlerThunkConfig = {
  eventHandler:(params:any)=>{

    const updatedState:PlayerScoreData = JSON.parse(JSON.stringify(params.componentStore));
    console.log(JSON.stringify(params));

    const index = (params.targetId.split("_")[1]);
    const name  = params.targetId.split("_")[0];
    for(let i=0;i<updatedState.playerScores.length;i++){
      if(updatedState.playerScores[i].name === name){
        updatedState.playerScores[i].scoreData[index] = params.formSelector.getValue(params.targetId);

        return updatedState;
      }
    }
  },
  componentReducer:(data:PlayerScoreData)=>data
}

export const CLEAR_DATA_HANDLER: EventHandlerThunkConfig = {
  eventHandler:()=>{
    console.log("Hi");
  },
  globalStoreReducer:()=>{
    console.log("Potatoes")
    return {
      [PLAYER_SCORES]: {
        scoreFields:[],
        playerScores: []
      }
    }
  }
}

export const ADD_SCORE_EVENT_HANDLER: EventHandlerThunkConfig = {
  eventHandler:(params:any) => {
    return {
      playerName: params.params.playerName,
      score: params.formSelector.getValue("add_score_"+params.params.playerName),
      scoreCount: params.params.scoreCount,
      scoreState: params.params.scoreData};
  },
  globalStoreReducer:(params:any)=>{

    const scores: PlayerScoreData = params.scoreState;

    let updatedState:PlayerScoreData = {
      scoreFields:Array.from(scores.scoreFields),
      playerScores: []
    }

    scores.playerScores.forEach((playerScore: PlayerScore)=>{

      let updatedPlayerScore:Record<string,string> = {...playerScore.scoreData};

      if(playerScore.name === params.playerName){

        const scoreCount = params.scoreCount
        updatedPlayerScore[""+scoreCount.toString()] = params.score;


        if(scores.scoreFields.length -1 < params.scoreCount) {
          updatedState.scoreFields.push(""+params.scoreCount);
        }
      }

      updatedState.playerScores.push({
        name: playerScore.name,
        scoreData: updatedPlayerScore
      })


    });

    return {
      [PLAYER_SCORES]: updatedState
    }

  }
}