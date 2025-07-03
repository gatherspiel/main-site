import {BasePage} from "../component/shared/BasePage.ts";
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

const CIRCLE_RADIUS = 50;

function clearCanvas(context:any,width:any, height:any){
  context.clearRect(0,0, width, height);
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

let WAIT_INTERVALS = 500;
let INTERVAL_WAIT = 10;
let intervals = WAIT_INTERVALS;


function countdownFunction() {
  intervals --;
  drawWaitBar();

  if(intervals === 0){
    clearInterval(countdown);

    const random = new Random(MersenneTwister19937.autoSeed());

    const pickNum = random.integer(0,circles.length - 1);
    const pick:Circle = circles[pickNum];

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    clearCanvas(context, canvas.width, canvas.height);

    drawCircleWithColor(context, pick.x, pick.y, CIRCLE_RADIUS, pick.color)
    circles = [];
    countdown = -1;
  }
}

function addPlayer(x:number, y: number, canvas:any){
  var rect = canvas.getBoundingClientRect();


  const xPos = x - rect.left;
  const yPos = y - rect.top;
  drawCircle(context, xPos,  yPos, CIRCLE_RADIUS)

  if(countdown !== -1){
    clearInterval(countdown)
    intervals = WAIT_INTERVALS;
  }
  countdown = setInterval(countdownFunction, INTERVAL_WAIT)
}

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
      addPlayer(event.touches[0].pageX, event.touches[0].pageY, canvas);
    })

    canvas.addEventListener('click', function(event){
      // @ts-ignore
      if(event.pointerType === "mouse"){
        addPlayer(event.pageX, event.pageY, canvas);
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