/**
 * TODO
 *
 * -Fix issue with clearing data and not refreshing(This might be a framework issue)
 * -Make sure updating state in text boxes works
 * -Fix alignment of round headers
 * -Update styling of buttons
 */



import type {PlayerScore, PlayerScoreData} from "./types/PlayerScoreData.ts";
import {
  ADD_PLAYER_HANDLER,
  ADD_SCORE_EVENT_HANDLER,
  CLEAR_DATA_HANDLER,
  UPDATE_SCORE_HANDLER
} from "./ScoreEventHandlers.ts";
import {createPlayerScoresThunk} from "./PlayerScoresThunk.ts";
import {
  BaseTemplateDynamicComponent,
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

//TODO: Implement option for players to see round scores by scrolling.
const SHOW_ROUND_SCORES = false;

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
    return `<style>

      table {
        width:100%;
        table-layout:fixed;
      }
      th {
        font-size: 3rem;
        padding:20px;

      }
      
      #top input {
        max-height: 3rem;
      }
      td {
        font-size: 3rem;
        padding:20px;
      }

      #top, #clear {
        padding-top:3rem;
        display: flex;
        justify-content: center
      }
      
      input {
        border: 5px solid var(--clr-dark-blue);
        font-size: 3rem;
        max-width:5rem;
      }
      #clear div {
        justify-content: center;
      }
      
      table input {
        font-size: 3rem;
        padding-bottom: 0.5rem;
        padding-top: 0.5rem;
        padding-left: 0.1rem;
      }
      
      #top input {
        font-size: 5rem;
        max-height: 4.5rem;
        max-width:30rem;
      }
      
      #top button {
        margin-right:3rem;
        margin-left: 3rem;
      }
      
      #score-info {
        overflow-x: auto
      }
      button {
        background-color: var(--clr-light-blue);
        font-size: 5rem;
        border-radius: 15px;
      }
      


    </style>`;
  }

  renderPlayerInfo(playerScore:PlayerScore, scoreFields:string[], data: PlayerScoreData){

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

      if(SHOW_ROUND_SCORES){
        scoreHtml+= `<td> ${this.addShortInput({
          eventConfig: UPDATE_SCORE_HANDLER,
          id: playerScore.name + "_" + id,
          inputType: "text",
          value: ""+score
        })} </td>`
      }


      id ++;
    })

    html+= `
      <td>
        <span>Total score: ${totalScore}</span>
      </td>
       <td>
        <button
          value="Add score"
          ${this.createEvent(ADD_SCORE_EVENT_HANDLER, "click",{
          playerName: playerScore.name,
          scoreCount: scoreCount,
          scoreData: data
        })}
          >Add score</button>
      </td>
      <td>  
         ${self.addShortInput({ id: "add_score_"+playerScore.name,
        inputType: "text",
        value: ""})}
     </td>

    `

    html+= scoreHtml;
    html+=`</tr>`

    return html;
  }

  renderScoreFields(data:PlayerScoreData){

    console.log(data.scoreFields)
    let html=`
      <th>Player</th>
      <th></th> 
      <th></th>
      <th></th>`;


    if(SHOW_ROUND_SCORES){
      data.scoreFields.forEach(item=>{
        html+= `
    
        <th scope="col">Round ${item}</th>
      `
      })
    }



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
      <div id = "top">
        <div>
        ${self.addShortInput({
          id: "add_player_input",
          inputType: "text",
          lineBreakAfterLabel:false,
          value: ""
        })}
        </div>
        <div>
        <button value="Add player" ${this.createEvent(ADD_PLAYER_HANDLER,"click")}>Add player</button>
        </div>
        <div>
        </div>
      </div>
      
      <div id = "clear">
        <div>
         <button value="Clear" ${this.createEvent(CLEAR_DATA_HANDLER,"click")}>Clear scores and players</button>
       
        </div>
      </div>
   
    <div id="table-wrapper">

          <table>
            <thead>
              ${this.renderScoreFields(data)}
            </thead>
            <tbody>
              ${this.renderPlayers(data)}
            </tbody>    
          </table>   

      </div>

      `


    return html;


  }
}


if (!customElements.get("score-component")) {
  customElements.define("score-component", ScoreTrackerComponent);
}