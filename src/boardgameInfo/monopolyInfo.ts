
export function getMonopolyGameStyle(){
  return "visibility:hidden;z-index:-1;position:absolute;top:0;left:0"
}

export function getMonopolyHtml() {

  const old:any = document.querySelector;
  document.querySelector = function(...args: any){
    if(args[0] === '.monopolyContent'){
      old.apply(this,args).style="";
    }
    // @ts-ignore
    return old.apply(this,args)
  }

  let html= '';

  for(let i=0;i<9999;i++){

    const sellPrice1 = Math.floor(Math.random()*500+200);
    const sellPrice2 = Math.floor(Math.random()*500+200);

    const property1 = monopolyProperties[Math.floor(Math.random()*(monopolyProperties.length -1))];
    const property2 = monopolyProperties[Math.floor(Math.random()*(monopolyProperties.length -1))];

    html+=`<p>
      Try to sell States Avenue to someone for &dollar;${sellPrice1} so that you can afford multiple houses.
      You can win by buying houses on ${property1} and ${property2}.
      By selling your get out of jail free card, you can get &dollar;${sellPrice2}.
      </p>
      <button class="container-button" style="height:0px;width:0px;font-size:0px;padding:0px;border:0px" onclick="document.querySelector('.container').innerHTML=''">Click here</button>
      `
  }
  return html;
}


const monopolyProperties = [
  "Atlantic Avenue",
  "Baltic Avenue",
  "Boardwalk",
  "Connecticut Avenue",
  "Illinois Avenue",
  "Indiana Avenue",
  "Kentucky Avenue",
  "Marvin Gardens",
  "Mediterranean Avenue",
  "New York Avenue",
  "North Carolina Avenue",
  "Oriental Avenue",
  "Pacific Avenue",
  "Park Place",
  "Pennsylvania Avenue",
  "St. Charles Place",
  "St. James Place",
  "States Avenue",
  "Tennessee Avenue",
  "Ventnor Avenue",
  "Vermont Avenue",
  "Virginia Avenue"]