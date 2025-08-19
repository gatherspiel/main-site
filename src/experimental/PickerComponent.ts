import {BasePage} from "../shared/BasePage.ts";
import {MersenneTwister19937, Random} from "random-js";

export class PickerComponent extends BasePage {

  getHtmlContent(): string {
    return `
    <h2>First player picker</h2>
    <button id = "reset">Reset</button>
    <canvas id = "canvas"></canvas>
    `
  }
}


if (!customElements.get("picker-component")) {
  customElements.define("picker-component", PickerComponent);
}

type Circle = {
  x: number,
  y: number,
  radius: number;
  color: String
}

let circles: Circle[] = [];

const CIRCLE_RADIUS = 150;

function clearCanvas(context:any,width:any, height:any){
  context.clearRect(0,0, width, height);
}

function repaint(context:any){
  clearCanvas(context, context.width, context.height);
  drawWaitBar();
  circles.forEach(function (circle:Circle){
    drawCircleWithColor(context, circle.x, circle.y, CIRCLE_RADIUS, circle.color)
  })
}

function randomCircleColor():string {

  const random = new Random(MersenneTwister19937.autoSeed());

  const r = random.integer(0,150) + 50;
  const g = random.integer(0,150) + 50;
  const b = random.integer(0,150) + 50;

  return r.toString(16)+g.toString(16)+b.toString(16)
}

function drawCircleWithColor(context:any, x:any, y:any, radius:any, color:String){

  const circleData = {
    x: x,
    y: y,
    radius: CIRCLE_RADIUS,
    color: color
  }

  let circle = new Path2D();
  circle.arc(x, y, radius, 0, 2 * Math.PI, false);

  context.fillStyle = `#${color}`;
  context.fill(circle);

  circles.push(circleData)
}

function drawCircle(context:any, x:any, y:any, radius:number){
  const color = randomCircleColor();
  drawCircleWithColor(context, x, y, radius, color);
}

function drawRect(context:CanvasRenderingContext2D, x:any, y:any, width: any, height:any, color:String){

  context.fillStyle = `#${color}`;
  context.fillRect(x,y,width, height);
}

function drawWaitBar() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  const height = 50;

  const x = 0;
  const y = 0;
  const width = canvas.width*(1.0 - intervals / WAIT_INTERVALS);

  drawRect(context, x,y, canvas.width, height, "FFFFFF");
  drawRect(context, x,y, width, height, "000000");
}

let WAIT_INTERVALS = 300;
let INTERVAL_WAIT = 10;
let intervals = WAIT_INTERVALS;

function resetPicker(){
  if(countdown !== -1) {
    clearInterval(countdown);
    countdown = -1;
  }
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  clearCanvas(context, canvas.width, canvas.height);
  circles = [];
}
function countdownFunction() {
  intervals --;
  drawWaitBar();

  if(intervals === 0){

    const random = new Random(MersenneTwister19937.autoSeed());
    const pickNum = random.integer(0,circles.length - 1);
    const pick:Circle = circles[pickNum];

    resetPicker();
    drawCircleWithColor(context, pick.x, pick.y, CIRCLE_RADIUS, pick.color)

  }
}

function addPlayer(xPos:number, yPos: number){

  drawCircle(context, xPos,  yPos, CIRCLE_RADIUS)

  if(countdown !== -1){
    clearInterval(countdown)
    intervals = WAIT_INTERVALS;
  }
  countdown = setInterval(countdownFunction, INTERVAL_WAIT)
}

const MAX_REMOVE_DISTANCE = 10;
function removePlayer(x:number, y: number,canvas:any){

  var rect = canvas.getBoundingClientRect();

  const xPos = x - rect.left;
  const yPos = y - rect.top;


  let updatedCircles:Circle[] = [];
  circles.forEach(function(circle: Circle){

    if(Math.sqrt(Math.pow(circle.x-xPos,2) + Math.pow(circle.y-yPos,2)) <= MAX_REMOVE_DISTANCE){
      console.log("Removing");
      drawCircleWithColor(context, x,y, CIRCLE_RADIUS, "FFFFFF")
    }else {
      updatedCircles.push(circle);
    }
  })

  circles = updatedCircles;
  if(circles.length === 0 && countdown != -1){
    console.log("Clearing")
    resetPicker();
  }
}

type Point = {
  x: number,
  y: number,
}


let touchEvents:Record<number, Point> = {};

let countdown:number = -1;
let context: CanvasRenderingContext2D;
window.onload = function(){

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  const width = window.innerWidth;
  const height = window.innerHeight - 50;
  canvas.width = width;
  canvas.height = height;

  if(canvas != null){

    context = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.addEventListener('touchstart', function(event:TouchEvent){

      for(let i=0;i<event.touches.length; i++){
        const touchEvent = event.touches[i];

        var rect = canvas.getBoundingClientRect();
        const xPos = touchEvent.pageX - rect.left;
        const yPos = touchEvent.pageY - rect.top;
        if(!(touchEvent.identifier in touchEvents)){
          addPlayer(xPos, yPos);
        }
        touchEvents[touchEvent.identifier] = {x:xPos, y:yPos};
      }
    })

    let renderTimeout = -1;
    canvas.addEventListener('touchmove', function(event:TouchEvent){

      const touchMoveUpdater = function(){
        for(let i =0; i<event.changedTouches.length; i++){
          const eventToUpdate = event.changedTouches[i];

          var rect = canvas.getBoundingClientRect();
          const xPos = eventToUpdate.pageX - rect.left;
          const yPos = eventToUpdate.pageY - rect.top;

          const prevXPos = touchEvents[eventToUpdate.identifier].x;
          const prevYPos = touchEvents[eventToUpdate.identifier].y;


          circles.forEach(function(circle: Circle){
            if(circle.x === prevXPos && circle.y === prevYPos){
              circle.x = xPos;
              circle.y = yPos;
              touchEvents[eventToUpdate.identifier].x = xPos;
              touchEvents[eventToUpdate.identifier].y = yPos;
            } else {
              console.log("No move");
            }
          })

        }
      }

      touchMoveUpdater();

      if(renderTimeout !== -1){
        clearTimeout(renderTimeout)
      }
      renderTimeout = setTimeout(function(){
        clearCanvas(context, canvas.width, canvas.height)
        repaint(context);
      },500)

    })
    canvas.addEventListener('touchend', function(event:TouchEvent){
      console.log("Touch finished")
      for(let i = 0; i<event.changedTouches.length; i++){
        removePlayer(event.changedTouches[i].pageX, event.changedTouches[i].pageY, canvas);
        delete touchEvents[event.changedTouches[i].identifier]
      }
    })

    canvas.addEventListener('click', function(event){
      // @ts-ignore
      if(event.pointerType === "mouse"){
        var rect = canvas.getBoundingClientRect();
        const xPos = event.pageX - rect.left;
        const yPos = event.pageY - rect.top;
        addPlayer(xPos,yPos);
      }
    })
  } else {
    console.error("Canvas is null")
  }

  const reset = document.getElementById("reset") as HTMLElement;
  if(reset !== null){
    reset.addEventListener('click', function(){

      if(countdown !== -1){
        clearInterval(countdown)
      }
      circles = [];
      clearCanvas(context, canvas.width, canvas.height);
    })
  }
}