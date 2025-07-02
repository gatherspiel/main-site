import {BasePage} from "./shared/BasePage.ts";

export class FeedbackPageComponent extends BasePage {

  getHtmlContent(): string {
    return `
    <p>To submit feedback or thoughts on new features, send an email to gulu@createthirdplaces.com.</p>`
  }
}

if (!customElements.get("feedback-page-component")) {
  customElements.define("feedback-page-component", FeedbackPageComponent);
}
