import {BasePage} from "./shared/BasePage.ts";

export class HomepageComponent extends BasePage {
  getHtmlContent(): string {
    return `
     <div>
      <h1>Gatherspiel</h1>
      <img src="/img/gatherspiel_logo.svg" width="400px"></img>
      <p>Gatherspiel is a non-commercial open source platform to support in person board game events. Contact
        gulu@createthirdplaces.com for more details. </p>
      </p>
      
      <p><a href="https://dmvboardgames.com/">Here</a> is an example of a site built using the Gatherspiel platform.</p>
    </div>
   `
  }
}

if (!customElements.get("homepage-component")) {
  customElements.define("homepage-component", HomepageComponent);
}
