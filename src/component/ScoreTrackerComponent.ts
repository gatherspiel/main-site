
import BaseDynamicComponent from "@bponnaluri/places-js"

export class ScoreTrackerComponent extends BaseDynamicComponent {

}


if (!customElements.get("score-component")) {
  customElements.define("score-component", ScoreTrackerComponent);
}