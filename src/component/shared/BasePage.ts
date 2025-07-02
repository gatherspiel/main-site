

export abstract class BasePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
     <div class="container">
      <div class="navbar">
        <nav>
          <a href="index.html">Home</a>
          <a href="vision.html">Vision</a>
          <a href="help.html">Looking to help </a>
          <a href="feedback.html">Share feedback</a>
        </nav>
      </div>
      <div class="content">
        ${this.getHtmlContent()}
      </div>
    </div>
    `
  }

  abstract getHtmlContent(): string
}