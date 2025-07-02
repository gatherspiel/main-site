import {BasePage} from "../component/shared/BasePage.ts";
import {MersenneTwister19937, Random} from "random-js";

export class PickerComponent extends BasePage {

  getHtmlContent(): string {
    return `
    <p>First player picker</p>
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
}

const circles: Circle[] = [];

const CIRCLE_RADIUS = 50;

function randomCircleColor():string {

  const random = new Random(MersenneTwister19937.autoSeed());

  const r = random.integer(0,200);
  const g = random.integer(0,200);
  const b = random.integer(0,200);

  return r.toString(16)+g.toString(16)+b.toString(16)
}

function drawCircleWithColor(context:any, x:any, y:any, color:String){
  let circle = new Path2D();
  circle.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI, false);

  console.log(color)
  context.fillStyle = `#${color}`;
  context.fill(circle);

  context.lineWidth = 1;
  context.strokeStyle = '#000066';
  context.stroke(circle);
  circles.push({
    x: x,
    y: y,
    radius: CIRCLE_RADIUS
  })
}
function drawCircle(context:any, x:any, y:any){
  const color = randomCircleColor();
  drawCircleWithColor(context, x, y, color);
}

let seconds = 10;

function countdownFunction() {
  seconds --;
  console.log(seconds);

  if(seconds === 0){
    clearInterval(countdown);

    const random = new Random(MersenneTwister19937.autoSeed());

    const pickNum = random.integer(0,circles.length - 1);
    const pick:Circle = circles[pickNum];

    circles.forEach(function(circle){

    })
    countdown = -1;
  }
}

let countdown:number = -1;

window.onload = function(){

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  const width = window.innerWidth;
  canvas.width = width;
  canvas.height = 500;

  if(canvas != null){

    var context = canvas.getContext('2d') as CanvasRenderingContext2D;



    console.log(canvas.width);
    console.log(canvas.height);
    canvas.addEventListener('click', function(event){
      var rect = canvas.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.pageY - rect.top;
      drawCircle(context, x, y)

      if(countdown !== -1){
        clearInterval(countdown)
        seconds = 10;
      }
      countdown = setInterval(countdownFunction, 1000,)
    })


  } else {
    console.error("Canvas is null")
  }
}