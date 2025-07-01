import './style.css'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Gatherspiel</h1>
    
    <p>Gatherspiel is a non-commercial open source platform to support in person board game events. Contact 
    gulu@createthirdplaces.com for more details. </p>
   
   
    <p> If you are interested in helping with project development, go  <a href="https://github.com/gatherspiel">here.</a>
    </p>
 
    
    <p></p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
