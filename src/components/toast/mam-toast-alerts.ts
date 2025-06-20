import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@brightspace-ui/core/components/alert/alert.js";

@customElement("mam-toast-alerts")
export class MamToastAlerts extends LitElement {
  @state()
  private showSuccess = false;

  @state()
  private showError = false;

  static styles = css`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      color: black;
      gap: 12px;
    }
  `;

  public showSuccessMessage() {
    this.showSuccess = true;
    setTimeout(() => (this.showSuccess = false), 5000);
  }

  public showErrorMessage() {
    this.showError = true;
    setTimeout(() => (this.showError = false), 5000);
  }

  render() {
    return html`
      <div class="toast-container">
        ${this.showSuccess
          ? html`<d2l-alert
              type="success"
              has-close-button
              @d2l-alert-close=${() => (this.showSuccess = false)}
            >
              Image successfully added
            </d2l-alert>`
          : ""}
        ${this.showError
          ? html`<d2l-alert
              type="error"
              has-close-button
              @d2l-alert-close=${() => (this.showError = false)}
            >
              Something went wrong. Image not saved
            </d2l-alert>`
          : ""}
      </div>
    `;
  }
}
