



import type {PlayerScore, PlayerScoreData} from "./types/PlayerScoreData.ts";
import {ADD_PLAYER_HANDLER, ADD_SCORE_EVENT_HANDLER, CLEAR_DATA_HANDLER} from "./ScoreEventHandlers.ts";
import {createPlayerScoresThunk} from "./PlayerScoresThunk.ts";
import {
  BaseTemplateDynamicComponent,
  COMPONENT_LABEL_KEY,
  type ComponentLoadConfig,
  GLOBAL_STATE_LOAD_CONFIG_KEY
} from "../framework/src";

export const PLAYER_SCORES = "playerScores";

const loadConfig:ComponentLoadConfig = {
  dataFields:[{
    fieldName: PLAYER_SCORES,
    dataSource: createPlayerScoresThunk()
  }],
  [GLOBAL_STATE_LOAD_CONFIG_KEY]:{
    globalFieldSubscriptions:[PLAYER_SCORES],
    defaultGlobalStateReducer: (data:any)=>{
      sessionStorage.setItem(PLAYER_SCORES, JSON.stringify(data.playerScores))
      return data.playerScores;
    }
  }
}

export class ScoreTrackerComponent extends BaseTemplateDynamicComponent{

  constructor() {
    super(loadConfig);
  }
  connectedCallback(){
    this.retrieveData({
      scoreFields: [],
      playerScores: [],
    });

  }

  getTemplateStyle(): string {
    return "<style></style>";
  }

  renderPlayerInfo(playerScore:PlayerScore, scoreFields:string[], data: PlayerScoreData){

    console.log(playerScore);

    let self = this;
    let html = `<tr>
      <th scope = "row"> ${playerScore.name}</th>
    `;


    let scoreHtml = ``;
    let id = 0;

    let scoreCount = 0;

    let totalScore = 0;
    scoreFields.forEach((field:string)=>{
      let score = 0;
      if(field in playerScore.scoreData){
        const roundScore = playerScore.scoreData[field];
        if(roundScore){
          scoreCount++
        }
        score = parseInt(roundScore);
      }

      totalScore+= score;
      scoreHtml+= `<td> ${this.addShortInput({
        id: playerScore.name + "_" + id,
        [COMPONENT_LABEL_KEY]: '',
        inputType: "text",
        value: ""+score
      })} </td>`

      id ++;
    })

    html+= `
      <td>
        <span>Total score: ${totalScore}</span>
      </td>
      <td>  
         ${self.addShortInput({ id: "add_score_"+playerScore.name,
        [COMPONENT_LABEL_KEY]: '',
        inputType: "text",
        value: ""})}
        <button
          value="Add score"
          ${this.createEvent(ADD_SCORE_EVENT_HANDLER, "click",{
            playerName: playerScore.name,
            scoreCount: scoreCount,
            scoreData: data
          })}
          >Add score</button>
      </td>
    `

    html+= scoreHtml;
    html+=`</tr>`

    return html;
  }

  renderScoreFields(data:PlayerScoreData){
    let html='';

    data.scoreFields.forEach(item=>{
      html+= `
        <th scope="col">Round ${item}</th>
      `
    })


    return html
  }

  renderPlayers(data: PlayerScoreData){
    let html = '';
    let self = this;
    data.playerScores.forEach((score:PlayerScore)=>{
      html+= self.renderPlayerInfo(score, data.scoreFields, data)
    })
    return html;
  }

  render(data:PlayerScoreData){

    let self = this;
    let html = `
       ${self.addShortInput({ id: "add_player_input",
      [COMPONENT_LABEL_KEY]: '',
      inputType: "text",
      value: ""})}
      <button value="Add player" ${this.createEvent(ADD_PLAYER_HANDLER,"click")}>Add player</button>
      <button value="Clear" ${this.createEvent(CLEAR_DATA_HANDLER,"click")}>Clear scores and players</button>

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


    return html;


  }
}


if (!customElements.get("score-component")) {
  customElements.define("score-component", ScoreTrackerComponent);
}