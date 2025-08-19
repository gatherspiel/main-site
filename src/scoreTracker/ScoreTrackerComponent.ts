

import {BaseTemplateDynamicComponent} from "@bponnaluri/places-js";

import {
  COMPONENT_LABEL_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
} from "@bponnaluri/places-js";
import {PLAYER_SCORES, setupStateFields} from "./InitGlobalStateConfig.ts";
import type {PlayerScore, PlayerScoreData} from "./types/PlayerScoreData.ts";
import {ADD_PLAYER_HANDLER, ADD_SCORE_EVENT_HANDLER} from "./ScoreEventHandlers.ts";
import {createPlayerScoresThunk} from "./PlayerScoresThunk.ts";

const loadConfig = {
  dataFields:[{
    fieldName: PLAYER_SCORES,
    dataSource: createPlayerScoresThunk()
  }],
  [GLOBAL_STATE_LOAD_CONFIG_KEY]:{
    globalFieldSubscriptions:[PLAYER_SCORES],
    defaultGlobalStateReducer: (data:any)=>{
      const storeData = JSON.parse(data.playerScores);
      sessionStorage.setItem(PLAYER_SCORES, JSON.stringify(storeData))
      return data.playerScores;
    }
  }
}

setupStateFields();
export class ScoreTrackerComponent extends BaseTemplateDynamicComponent{

  constructor() {
    super(loadConfig);
  }
  connectedCallback(){
    this.retrieveData({
      hideEvents: false,
      scoreFields: [],
      playerScores: [],
      hideGameStores: true
    });

  }

  getTemplateStyle(): string {
    return "<style></style>";
  }

  renderPlayerInfo(playerScore:PlayerScore, scoreFields:string[]){

    let html = `<tr>
      <th scope = "row"> ${playerScore.name}</th>
    `;

    let id = 0;
    let totalScore = 0;
    scoreFields.forEach((field:string)=>{
      let score = 0;
      if(field in playerScore.scoreData){
        totalScore = parseInt(playerScore.scoreData[field]);
      }

      totalScore+= score;
      html+= `<td> ${this.addTextInput({
        id: playerScore.name + "_" + id,
        [COMPONENT_LABEL_KEY]: '',
        inputType: "text",
        value: ""+score
      })} </td>`

      id ++;
    })

    html+= `<span>Total score: ${totalScore}</span>`

    html+=`<button
      value="Add score"
      ${this.createEvent(ADD_SCORE_EVENT_HANDLER, "click",{playerName: playerScore.name,scoreCount: scoreFields.length})}
    >
      
    </button>
    </tr>
      `

    return html;
  }

  renderScoreFields(data:PlayerScoreData){
    let html='';

    data.scoreFields.forEach(item=>{
      html+= `
        <th scope="col">${item}</th>
      `
    })
    return html
  }

  renderPlayers(data: PlayerScoreData){
    let html = '';
    let self = this;
    data.playerScores.forEach((score:PlayerScore)=>{
      html+= self.renderPlayerInfo(score, data.scoreFields)
    })
    return html;
  }
  render(data:PlayerScoreData){

    let self = this;
    let html = `
       ${self.addTextInput({ id: "add_player_input",
      [COMPONENT_LABEL_KEY]: '',
      inputType: "text",
      value: ""})}
      <button value="Add player" ${this.createEvent(ADD_PLAYER_HANDLER,"click")}>Add player</button>
    <table>
      <thead>
        ${this.renderScoreFields(data)}
      </thead>
      <tbody>
        ${this.renderPlayers(data)}
      </tbody>
      <tr>
        <th scope="row"></th>
      </tr>
      
      
    </table>
      `

    data.playerScores.forEach((playerScore:PlayerScore)=>{
      html+= self.renderPlayerInfo(playerScore, data.scoreFields);
    });

    return html;
  }
}


if (!customElements.get("score-component")) {
  customElements.define("score-component", ScoreTrackerComponent);
}