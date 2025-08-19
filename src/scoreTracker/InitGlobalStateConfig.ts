import { setupGlobalState } from "@bponnaluri/places-js"

let stateFields:Record<string, string> = {};

export const PLAYER_SCORES = "playerScores";


export function setupStateFields(){
  stateFields =  {
    PLAYER_SCORES:  PLAYER_SCORES,
  };
  setupGlobalState(stateFields);
}