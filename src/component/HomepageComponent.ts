import {BasePage} from "./shared/BasePage.ts";

export class HomepageComponent extends BasePage {
  getHtmlContent(): string {
    return `
     <div>
      <h1>Gatherspiel</h1>
      <img src="public/img/gatherspiel_logo.svg" width="400px"></img>
      <p>Gatherspiel will a non-commercial open source platform to support in person board game events. Contact
        gulu@createthirdplaces.com for more details </p>
      </p>
      <p></p>
    </div>
   `
  }
}

if (!customElements.get("homepage-component")) {
  customElements.define("homepage-component", HomepageComponent);
}