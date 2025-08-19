
import {createUpdatePlayerScoresThunk} from "./PlayerScoresThunk.ts";
import type {EventHandlerThunkConfig} from "@bponnaluri/places-js";

export const ADD_SCORE_EVENT_HANDLER: EventHandlerThunkConfig = {
  eventHandler:(params:any) => {


    return {playerName: params.playerName,score: params.formSelector.getValue(),scoreCount: params.scoreCount, scoreState: params.componentStore};
  },
  apiRequestThunk: createUpdatePlayerScoresThunk()
}