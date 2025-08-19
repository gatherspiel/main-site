
import {createNewPlayerThunk, createUpdatePlayerScoresThunk} from "./PlayerScoresThunk.ts";
import type {EventHandlerThunkConfig} from "@bponnaluri/places-js";

export const ADD_PLAYER_HANDLER: EventHandlerThunkConfig = {
  eventHandler:(params:any)=>{
    return {
      playerName:params.formSelector.getValue("add_player_input"),
      scoreState: params.componentStore
    }
  },
  apiRequestThunk: createNewPlayerThunk()
}

export const ADD_SCORE_EVENT_HANDLER: EventHandlerThunkConfig = {
  eventHandler:(params:any) => {
    return {
      playerName: params.params.playerName,
      score: params.formSelector.getValue("add_score_"+params.params.playerName),
      scoreCount: params.params.scoreCount,
      scoreState: params.params.scoreData};
  },
  apiRequestThunk: createUpdatePlayerScoresThunk()
}