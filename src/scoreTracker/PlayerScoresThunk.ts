
import {PLAYER_SCORES} from "./ScoreTrackerComponent.ts";
import {BaseThunk} from "@bponnaluri/places-js";


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









