import {BasePage} from "./shared/BasePage.ts";

export class HelpPageComponent extends BasePage {
  getHtmlContent(): string {
    return `
     <p>If you are interested in helping, send an email to gulu@createthirdplaces.com.</p>
     <p>Source code for the project is <a href="https://github.com/gatherspiel">here.</a></p>
   `
  }
}

if (!customElements.get("help-page-component")) {
  customElements.define("help-page-component", HelpPageComponent);
}
